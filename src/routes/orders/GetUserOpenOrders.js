const OrderbookApi = require('./../../api/OrderbookApi');
const AuthService = require('./../../services/AuthService');


class GetUserOpenOrders {
  async handle(request, reply) {
    const market = request.params.market;

    const { token } = await AuthService.getAuthData(request.auth.credentials);

    const orders = await OrderbookApi.orders.getUserOpenOrders(token, market);

    return reply(orders);
  }
}


module.exports = new GetUserOpenOrders();
