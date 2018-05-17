const LOG = require('log4js').getLogger('CancelOrderHandler.js');

const Signer = require('../../util/Signer');
const OrderbookApi = require('./../../api/OrderbookApi');
const LocalStorage = require('./../../services/LocalStorage');
const AuthService = require('./../../services/AuthService');


class CancelOrderHandler {
  async handle(request, reply) {
    const { orderId, market } = request.payload;

    const { token, privateKey, userContractAddress, email } = await AuthService.getAuthData(request.auth.credentials);

    LOG.info(`User: ${email}. Try to cancel order. Market: ${market}, orderId: ${orderId}`);

    const nonce = await OrderbookApi.account.getNonce(token);

    const { address: OBAddress, contract } = LocalStorage.getOBContract();

    const data = contract.cancelOrder.getData(market, orderId);

    const { op, sig } = Signer.prepareOperation(
      OBAddress,
      0,
      data,
      userContractAddress,
      nonce,
      privateKey
    );

    const response = await OrderbookApi.orders.cancelOrder(token, market, orderId, nonce, sig, op);

    LOG.info(`User: ${email}. Order was canceled. Hash: ${response.hash}, market: ${market}, orderId: ${orderId}`);

    return reply(response);
  }
}


module.exports = new CancelOrderHandler();
