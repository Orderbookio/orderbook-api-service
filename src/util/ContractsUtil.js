const LOG = require('log4js').getLogger('ContractsUtil.js');

const Promise = require( 'bluebird');
const BigNumber = require('bignumber.js');

const Provider = require('./Provider');
const web3 = Provider.web3;
const LocalStorage = require('./../services/LocalStorage');

const assetsAbi = [{constant: false, inputs: [{name: '_spender', type: 'address'}, {name: '_value', type: 'uint256'}], name: 'approve', outputs: [{name: 'success', type: 'bool'}], payable: false, type: 'function'}, {constant: true, inputs: [], name: 'totalSupply', outputs: [{name: 'supply', type: 'uint256'}], payable: false, type: 'function'}, {constant: false, inputs: [{name: '_from', type: 'address'}, {name: '_to', type: 'address'}, {name: '_value', type: 'uint256'}], name: 'transferFrom', outputs: [{name: 'success', type: 'bool'}], payable: false, type: 'function'}, {constant: true, inputs: [{name: '_owner', type: 'address'}], name: 'balanceOf', outputs: [{name: 'balance', type: 'uint256'}], payable: false, type: 'function'}, {constant: false, inputs: [{name: '_to', type: 'address'}, {name: '_value', type: 'uint256'}], name: 'transfer', outputs: [{name: 'success', type: 'bool'}], payable: false, type: 'function'}, {constant: true, inputs: [{name: '_owner', type: 'address'}, {name: '_spender', type: 'address'}], name: 'allowance', outputs: [{name: 'remaining', type: 'uint256'}], payable: false, type: 'function'}, {anonymous: false, inputs: [{indexed: true, name: '_from', type: 'address'}, {indexed: true, name: '_to', type: 'address'}, {indexed: false, name: '_value', type: 'uint256'}], name: 'Transfer', type: 'event'}, {anonymous: false, inputs: [{indexed: true, name: '_owner', type: 'address'}, {indexed: true, name: '_spender', type: 'address'}, {indexed: false, name: '_value', type: 'uint256'}], name: 'Approved', type: 'event'}];


const ContractsUtil = {
  getAsset(symbol) {
    const assets  = LocalStorage.getAssets();
    const asset = { ...assets[symbol] };
    if (!asset) return null;

    const { contract, address } = asset;
    if (!contract) {
      asset.contract = web3.eth.contract(assetsAbi).at(address);
      Promise.promisifyAll(asset.contract);
    }

    return asset;
  },

  toRawAmount(amount, symbol) {
    const asset = this.getAsset(symbol);
    if (!asset) {
      LOG.warn(`Symbol ${symbol} not registered.`);
      return amount;
    }
    if (!amount.isBigNumber) {
      amount = new BigNumber(amount);
    }
    return amount.mul(Math.pow(10, asset.baseUnit));

  },

  toRealAmount(rawAmount, symbol) {
    const asset = this.getAsset(symbol);
    if (!asset) {
      LOG.warn(`Symbol ${symbol} not registered.`);
      return rawAmount;
    }
    if (!rawAmount.isBigNumber) {
      rawAmount = new BigNumber(rawAmount);
    }
    return rawAmount.dividedBy(Math.pow(10, asset.baseUnit));

  },

  pricePerTokenToUnit(price, baseCCY, counterCCY) {
    return this.toRealAmount(this.toRawAmount(price, counterCCY), baseCCY);
  },

  pricePerUnitToToken(price, baseCCY, counterCCY) {
    return this.toRealAmount(this.toRawAmount(price, baseCCY), counterCCY);
  },
};

module.exports = ContractsUtil;