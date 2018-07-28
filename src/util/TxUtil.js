const Promise = require('bluebird');
const ethUtil = require('ethereumjs-util');
const { stripHexPrefix } = ethUtil;

const ContractsUtil = require('./ContractsUtil');
const OrderbookApi = require('./../api/OrderbookApi');
const LocalStorage = require('./../services/LocalStorage');
const Signer = require('./Signer');

const Provider = require('./Provider');
const web3 = Provider.web3;

const assetsAbi = [{constant: false, inputs: [{name: '_spender', type: 'address'}, {name: '_value', type: 'uint256'}], name: 'approve', outputs: [{name: 'success', type: 'bool'}], payable: false, type: 'function'}, {constant: true, inputs: [], name: 'totalSupply', outputs: [{name: 'supply', type: 'uint256'}], payable: false, type: 'function'}, {constant: false, inputs: [{name: '_from', type: 'address'}, {name: '_to', type: 'address'}, {name: '_value', type: 'uint256'}], name: 'transferFrom', outputs: [{name: 'success', type: 'bool'}], payable: false, type: 'function'}, {constant: true, inputs: [{name: '_owner', type: 'address'}], name: 'balanceOf', outputs: [{name: 'balance', type: 'uint256'}], payable: false, type: 'function'}, {constant: false, inputs: [{name: '_to', type: 'address'}, {name: '_value', type: 'uint256'}], name: 'transfer', outputs: [{name: 'success', type: 'bool'}], payable: false, type: 'function'}, {constant: true, inputs: [{name: '_owner', type: 'address'}, {name: '_spender', type: 'address'}], name: 'allowance', outputs: [{name: 'remaining', type: 'uint256'}], payable: false, type: 'function'}, {anonymous: false, inputs: [{indexed: true, name: '_from', type: 'address'}, {indexed: true, name: '_to', type: 'address'}, {indexed: false, name: '_value', type: 'uint256'}], name: 'Transfer', type: 'event'}, {anonymous: false, inputs: [{indexed: true, name: '_owner', type: 'address'}, {indexed: true, name: '_spender', type: 'address'}, {indexed: false, name: '_value', type: 'uint256'}], name: 'Approved', type: 'event'}];
const ERC20_MOCK = web3.eth.contract(assetsAbi).at();

const txTypes = {
  APPROVE: 'approve',
  EXCHANGE: 'exchange',
  SET_AUTO_DEPOSIT: 'setAutoDeposit'
};

const txStatus = {
  PENDING: 'PENDING',
  DONE: 'DONE',
};


const TxUtil = {
  approve(authToken, assetSymbol, contractAddress, privateKey) {
    return Promise.try(async () => {
      const obContract = LocalStorage.getOBContract();

      const { contract: assetContract } = ContractsUtil.getAsset(assetSymbol);
      const assetContractAddress = assetContract.address.substr(2);

      const allowance = await OrderbookApi.account.getAllowance(authToken, assetSymbol, assetContract.address, obContract.address);

      if (allowance == 0) {
        const nonce = await OrderbookApi.account.getNonce(authToken);

        const formattedNonce = ethUtil.setLengthLeft(web3.toHex(nonce), 32).toString('hex');
        const formattedValue = ethUtil.setLengthLeft(web3.toHex(0), 32).toString('hex');
        const data = stripHexPrefix(ERC20_MOCK.approve.getData(obContract.address, '0xf000000000000000000000000000000000000000000000000000000000000000'));

        // format: 0x + destination + ethValue + data + ambiUserAddress + nonce
        const op = web3.sha3(
          `0x` +
          `${stripHexPrefix(assetContractAddress)}` + // 0x1b8e20909c8ea86505cf4e66dbf20438d3091c5f
          `${formattedValue}` +
          `${data}` +
          `${stripHexPrefix(contractAddress)}` +
          `${formattedNonce}`,
          { encoding: 'hex' }
        );
        const sig = Signer.sign(op, privateKey);

        const hash = await OrderbookApi.account.approve(authToken, assetSymbol, obContract.address, assetContract.address, nonce, op, sig);
        return hash;
      }

      return Promise.resolve();
    });
  },

  async isNeedApprove(token, email, asset, obContractAddress) {
    let approveTxs = LocalStorage.getApproveTxs(email);

    if (approveTxs.length === 0) {
      approveTxs = await OrderbookApi.txs.getTransactionsByTypes(token, [txTypes.APPROVE]);
      LocalStorage.setApproveTxs(email, approveTxs);
    }
    let isNeedApprove = true;

    approveTxs.forEach((tx) => {
      if (tx.status === txStatus.DONE || tx.status === txStatus.PENDING) {
        let { assetAddress, approveAddress } = JSON.parse(tx.options);

        if (assetAddress === asset.address && approveAddress === obContractAddress) {
          isNeedApprove = false;
        }
      }
    });

    return isNeedApprove;
  },

  async isNeedAutoDeposit(token, email) {
    let isAutoDepositRequired = LocalStorage.isAutoDepositRequired(email);

    if (isAutoDepositRequired) {
      const txs = await OrderbookApi.txs.getTransactionsByTypes(token, [txTypes.EXCHANGE, txTypes.SET_AUTO_DEPOSIT]);

      for (const tx of txs) {
        if (tx.status === txStatus.DONE || tx.status === txStatus.PENDING) {
          isAutoDepositRequired = false;
          break;
        }
      }

      LocalStorage.setAutoDepositRequired(email, isAutoDepositRequired);
    }

    return isAutoDepositRequired;
  },

  async setAutoDeposit(authToken, userContractAddress, privateKey) {
    const nonce = await OrderbookApi.account.getNonce(authToken);

    const { contract: assetContract, address } = ContractsUtil.getAsset('ETH');

    const data = assetContract.setAutoDeposit.getData(true);

    const { op, sig } = Signer.prepareOperation(
      address,
      0,
      data,
      userContractAddress,
      nonce,
      privateKey
    );

    const res = await OrderbookApi.account.setAutoDeposit(authToken, address, nonce, op, sig);
    return res.hash;
  }
};


module.exports = TxUtil;
