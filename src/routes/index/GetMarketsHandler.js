const OrderbookApi = require('./../../api/OrderbookApi');


class GetMarketsHandler {
  async handle(request, reply) {
    const markets = await OrderbookApi.orderbook.getMarkets();

    const marketNames = markets.map((m) => {
      const opt = m.options;
      if (opt.visible) {
        return m.name;
      }
    });

    return reply(marketNames);
  }
}

module.exports = new GetMarketsHandler();