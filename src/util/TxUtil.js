const Promise = require('bluebird');
const ethUtil = require('ethereumjs-util');

const ContractsUtil = require('./ContractsUtil');
const OrderbookApi = require('./../api/OrderbookApi');
const LocalStorage = require('./../services/LocalStorage');
const Signer = require('./Signer');

const Provider = require('./Provider');
const web3 = Provider.web3;


const TxUtil = {
  approve(authToken, assetSymbol, contractAddress, privateKey, nonce) {
    return Promise.try(async () => {
      const obContract = LocalStorage.getOBContract();

      const { contract: assetContract } = ContractsUtil.getAsset(assetSymbol);
      const allowance = await OrderbookApi.account.getAllowance(authToken, assetSymbol);

      if (allowance == 0) {
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

  }
};

module.exports = TxUtil;