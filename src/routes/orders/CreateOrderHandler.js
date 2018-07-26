const LOG = require('log4js').getLogger('CreateOrderHandler.js');

const BigNumber = require('bignumber.js');
const TxUtil = require('../../util/TxUtil');
const Signer = require('../../util/Signer');
const ContractsUtil = require('../../util/ContractsUtil');

const OrderbookApi = require('./../../api/OrderbookApi');

const LocalStorage = require('./../../services/LocalStorage');
const AuthService = require('./../../services/AuthService');


const BLOCKCHAIN_PRICE_MULTIPLIER = '1000000000000000000';
const PRICE_DECIMALS = new BigNumber(BLOCKCHAIN_PRICE_MULTIPLIER);


class CreateOrderHandler {
  async handle(request, reply) {
    const { type, market, amount, price } = request.payload;
    const [, baseCCY, counterCCY] = /(\S*)-(\S*)/g.exec(market);

    const assets = LocalStorage.getAssets();

    const { token, privateKey, userContractAddress, email } = await AuthService.getAuthData(request.auth.credentials);

    const validationErr = await validateParams(assets, request.payload, token, reply);

    if (validationErr) {
      return;
    }

    let method, assetSymbol;
    if (type === 'buy') {
      method = 'submitBuyOrder';
      assetSymbol = counterCCY;
    } else if (type === 'sell') {
      method = 'submitSellOrder';
      assetSymbol = baseCCY;
    }

    const asset = assets[assetSymbol];
    if (!asset) {
      return reply({ 'error': `Invalid market, ${assetSymbol} not found`}).code(400);
    }

    LOG.info(`User: ${email}. Try to create order. Market: ${market}, type: ${type}, amount: ${amount}, price: ${price}`);

    const { address: OBAddress, contract } = LocalStorage.getOBContract();

    // check and send approve tx
    if (await TxUtil.isNeedApprove(token, email, asset, OBAddress)) {
      await TxUtil.approve(token, assetSymbol, userContractAddress, privateKey);
    }

    // check and send autoDeposit Tx
    if ((type === 'buy' && baseCCY === 'ETH') || (type === 'sell' && counterCCY === 'ETH')) {
      if (await TxUtil.isNeedAutoDeposit(token, email)) {
        await TxUtil.setAutoDeposit(token, userContractAddress, privateKey);
      }
    }

    const nonce = await OrderbookApi.account.getNonce(token);


    const newOrderRawAmount = ContractsUtil.toRawAmount(amount, baseCCY).floor();
    const newOrderRawPrice = ContractsUtil.pricePerTokenToUnit(price, baseCCY, counterCCY);
    const formattedPrice = newOrderRawPrice.mul(PRICE_DECIMALS).floor();

    const data = contract[method].getData(market, formattedPrice, newOrderRawAmount);

    const { op, sig } = Signer.prepareOperation(
      OBAddress,
      0,
      data,
      userContractAddress,
      nonce,
      privateKey
    );

    const response = await OrderbookApi.orders.create(token, method, market, formattedPrice.toString(10), newOrderRawAmount.toString(10), nonce, sig, op);

    LOG.info(`User: ${email}. Created order. Hash: ${response.hash}`);

    return reply(response);
  }
}


async function validateParams(assets, payload, token, reply) {
  const { type, market, amount, price } = payload;
  const [, baseCCY, counterCCY] = /(\S*)-(\S*)/g.exec(market);

  const amountBN = new BigNumber(amount);
  const markets = await OrderbookApi.orderbook.getMarkets();
  const selectedMarket = markets.find((m) => m.name === market);
  const { fixedAmount, minAmount, maxAmount } = selectedMarket.options;
  const { minimalFeeEnabled } = selectedMarket;
  const { minimalFee: baseMinimalFee } = assets[baseCCY].fees;
  const { minimalFee: counterMinimalFee } = assets[counterCCY].fees;

  const isZeroAmount = new BigNumber(price).lte(0);
  const isZeroPrice = amountBN.lte(0);
  if (isZeroAmount || isZeroPrice) {
    return reply({ 'error': `Amount and price can\'t be 0.` }).code(405);
  }

  const isLessThanMinAmount = minAmount && amountBN.lt(minAmount);
  const isGreaterThanMaxAmount = maxAmount && amountBN.gt(maxAmount);

  if (!fixedAmount && isLessThanMinAmount) {
    return reply({ 'error': `Min amount is ${minAmount} ${baseCCY}` }).code(405);
  }

  if (!fixedAmount && isGreaterThanMaxAmount) {
    return reply({ 'error': `Max amount is ${maxAmount} ${baseCCY}` }).code(405);
  }

  const balances = await OrderbookApi.account.getBalances(token);
  let baseCCYBalance = 0;
  let counterCCYBalance = 0;
  balances.forEach((item) => {
    if (item.symbol === baseCCY) {
      baseCCYBalance = item.balance;
    } else if (item.symbol === counterCCY) {
      counterCCYBalance = item.balance;
    }
  });

  if (type === 'buy') {
    const counterCCYToSell = amountBN.mul(price);

    const isLessThanBaseUnit = counterCCYToSell.lt(ContractsUtil.toRealAmount(1, counterCCY));
    const isLessThanBaseMinFee = amountBN.lte(baseMinimalFee);

    if (isLessThanBaseUnit) {
      return reply({ 'error': `Total should be greater than the base unit of ${counterCCY}` }).code(405);
    }

    if (minimalFeeEnabled && isLessThanBaseMinFee) {
      return reply({ 'error': `Amount is less than minimal fee ${baseMinimalFee} ${baseCCY}` }).code(405);
    }

    if (new BigNumber(counterCCYBalance).lt(counterCCYToSell)) {
      return reply({ 'error': `Not enough ${counterCCY} at user balance. You have only ${counterCCYBalance} ${counterCCY}.` }).code(405);
    }
  } else if (type === 'sell') {

    const isLessThanCounterMinFee = amountBN.mul(price).lte(counterMinimalFee); // Total is less than minimal fee {minimalFee} {symbol}

    if (minimalFeeEnabled && isLessThanCounterMinFee) {
      return reply({ 'error': `Total is less than minimal fee ${counterMinimalFee} ${counterCCY}` }).code(405);
    }

    if (new BigNumber(baseCCYBalance).lt(amount)) {
      return reply({ 'error': `Not enough ${baseCCY} at user balance. You have only ${baseCCYBalance} ${baseCCY}.` }).code(405);
    }
  } else {
    LOG.warn(`Invalid type: ${type}`);
    return reply({ 'error': 'Invalid order type' }).code(405);
  }
}

module.exports = new CreateOrderHandler();
