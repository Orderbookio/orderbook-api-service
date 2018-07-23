const OrderbookApi = require('./../../api/OrderbookApi');
const AuthService = require('./../../services/AuthService');


class GetUserOrderStatus {
  async handle(request, reply) {
    const market = request.params.market;
    const orderHash = request.params.orderHash;

    const { token } = await AuthService.getAuthData(request.auth.credentials);

    const order = await OrderbookApi.orders.getOrderStatus(token, market, orderHash);

    return reply(order);
  }
}


module.exports = new GetUserOrderStatus();
