const LOG = require('log4js').getLogger('GetUserBalances.js');

const AuthService = require('./../../services/AuthService');
const OrderbookApi = require('./../../api/OrderbookApi');

class GetUserBalances {
  async handle(request, reply) {
    const authToken = await AuthService.getJWTToken(request.auth.credentials);

    try {
      return reply(await OrderbookApi.account.getBalances(authToken));
    } catch (err) {
      LOG.error(`Get user balances error: `, err);
      if (err.response) {
        return reply(err.response.data).code(400);
      } else {
        throw new Error(err);
      }
    }
  }
}

module.exports = new GetUserBalances();