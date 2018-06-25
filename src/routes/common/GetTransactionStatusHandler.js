const OrderbookApi = require('./../../api/OrderbookApi');


class GetTransactionStatusHandler {
  async handle(request, reply) {
    const hash = request.params.hash;

    try {
      return reply(await OrderbookApi.txs.getTransactionStatus(hash));
    } catch (err) {
      if (err.response && err.response.status === 400) {
        return reply(err.response.data).code(400);
      }
      throw err;
    }
  }
}


module.exports = new GetTransactionStatusHandler();
