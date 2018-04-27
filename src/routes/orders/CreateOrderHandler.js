const LOG = require('log4js').getLogger('CreateOrderHandler.js');

const BigNumber = require('bignumber.js');
const TxUtil = require('../../util/TxUtil');
const Signer = require('../../util/Signer');
const ContractsUtil = require('../../util/ContractsUtil');

const OrderbookApi = require('./../../api/OrderbookApi');

const LocalStorage = require('./../../services/LocalStorage');
const AuthService = require('./../../services/AuthService');

const methods = {
  BUY: 'buy',
  SELL: 'sell'
};


class CreateOrderHandler {
  async handle(request, reply) {
    const { type, market, amount, price } = request.payload;
    const [, baseCCY, counterCCY] = /(\S*)-(\S*)/g.exec(market);

    const { token, privateKey, userContractAddress, email } = await AuthService.getAuthData(request.auth.credentials);

    let method,
      assetSymbol;
    if (type === methods.BUY) {
      method = 'submitBuyOrder';
      assetSymbol = counterCCY;
    } else if (type === methods.SELL) {
      method = 'submitSellOrder';
      assetSymbol = baseCCY;
    } else {
      LOG.warn(`Client tried to create order with invalid type: ${type}`);
      return reply({ 'error': 'Invalid order type'}).code(400);
    }

    const assets = await LocalStorage.getAssets();
    const asset = assets[assetSymbol];
    if (!asset) {
      return reply({ 'error': `Invalid market, ${assetSymbol} not found`}).code(400);
    }

    // check and send approve tx
    if (TxUtil.isNeedApprove(token, email, asset)) {
      const nonce = await OrderbookApi.account.getNonce(token);
      await TxUtil.approve(token, assetSymbol, userContractAddress, privateKey, nonce);
    }

    const nonce = await OrderbookApi.account.getNonce(token);

    const { address: OBAddress, contract } = LocalStorage.getOBContract();

    const newOrderRawAmount = ContractsUtil.toRawAmount(amount, baseCCY).floor();
    const newOrderRawPrice = ContractsUtil.pricePerTokenToUnit(price, baseCCY, counterCCY);
    const PRICE_DECIMALS = new BigNumber('1000000000000000000');
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

    return reply(response);
  }
}

module.exports = new CreateOrderHandler();