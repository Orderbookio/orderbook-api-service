const Promise = require('bluebird');
const ethUtil = require('ethereumjs-util');

const ContractsUtil = require('./ContractsUtil');
const OrderbookApi = require('./../api/OrderbookApi');
const LocalStorage = require('./../services/LocalStorage');
const Signer = require('./Signer');

const Provider = require('./Provider');
const web3 = Provider.web3;

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
      const allowance = await OrderbookApi.account.getAllowance(authToken, assetSymbol);

      if (allowance === 0) {
        const nonce = await OrderbookApi.account.getNonce(authToken);

        const formattedNonce = ethUtil.setLengthLeft(web3.toHex(nonce), 32).toString('hex');
        const formattedValue = ethUtil.setLengthLeft(web3.toHex(0), 32).toString('hex');
        const assetContractAddress = assetContract.address.substr(2);
        const data = assetContract.approve.getData(obContract.address, '0xf000000000000000000000000000000000000000000000000000000000000000').substr(2);

        // format: 0x + destination + ethValue + data + ambiUserAddress + nonce
        const op = web3.sha3(`0x${assetContractAddress}${formattedValue}${data}${contractAddress.substr(2)}${formattedNonce}`, { encoding: 'hex' });
        const sig = Signer.sign(op, privateKey);

        const hash = await OrderbookApi.account.approve(authToken, assetSymbol, assetContract.address, nonce, op, sig);
        return hash;
      }

      return Promise.resolve();
    });
  },

  async isNeedApprove(token, email, asset) {
    const { address: assetAddress } = asset;

    let approveTxs = LocalStorage.getApproveTxs(email);

    if (approveTxs.length === 0) {
      approveTxs = await OrderbookApi.txs.getTransactionsByTypes(token, [txTypes.APPROVE]);
      LocalStorage.setApproveTxs(email, approveTxs);
    }
    let isNeedApprove = true;

    approveTxs.forEach((tx) => {
      if (tx.status === txStatus.DONE) {
        const options = JSON.parse(tx.options);
        if (assetAddress === options.assetAddress) {
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
      txs.forEach((tx) => {
        if (tx.status === txStatus.DONE || tx.status === txStatus.PENDING) {
          isAutoDepositRequired = false;
        }
      });

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
