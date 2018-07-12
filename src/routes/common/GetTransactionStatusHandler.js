const OrderbookApi = require('./../../api/OrderbookApi');
const AuthService = require('./../../services/AuthService');


class GetTransactionStatusHandler {
  async handle(request, reply) {
    const hash = request.params.hash;
    const { token } = await AuthService.getAuthData(request.auth.credentials);

    try {
      return reply(await OrderbookApi.txs.getTransactionStatus(token, hash));
    } catch (err) {
      if (err.response && err.response.status === 400) {
        return reply(err.response.data).code(400);
      }
      throw err;
    }
  }
}


module.exports = new GetTransactionStatusHandler();
