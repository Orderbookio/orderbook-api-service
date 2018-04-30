const AuthService = require('./../../services/AuthService');
const OrderbookApi = require('./../../api/OrderbookApi');


class GetUserBalances {
  async handle(request, reply) {
    const { token } = await AuthService.getAuthData(request.auth.credentials);
    return reply(await OrderbookApi.account.getBalances(token));
  }
}

module.exports = new GetUserBalances();