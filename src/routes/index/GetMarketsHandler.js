const OrderbookApi = require('./../../api/OrderbookApi');


class GetMarketsHandler {
  async handle(request, reply) {
    const markets = await OrderbookApi.orderbook.getMarkets();

    const result = [];
    markets.forEach((m) => {
      const opt = m.options;
      if (opt.visible) {
        result.push(m.name);
      }
    });

    return reply(result);
  }
}

module.exports = new GetMarketsHandler();