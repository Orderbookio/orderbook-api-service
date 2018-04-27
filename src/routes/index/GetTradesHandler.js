const OrderbookApi = require('./../../api/OrderbookApi');


class GetTradesHandler {
  async handle(request, reply) {
    const market = request.params.market;

    try {
      return reply(await OrderbookApi.orderbook.getTrades(market));
    } catch (err) {
      if (err.response.status === 400) {
        return reply(err.response.data).code(400);
      }
      throw err;
    }
  }
}

module.exports = new GetTradesHandler();