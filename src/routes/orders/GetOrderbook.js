const ContractsUtil = require('./../../util/ContractsUtil');

const OrderbookApi = require('./../../api/OrderbookApi');


class GetOpenOrders {
  async handle(request, reply) {
    const market = request.params.market;

    let baseCCY, counterCCY;
    try {
      [, baseCCY, counterCCY] = /(\S*)-(\S*)/g.exec(market);
    } catch (err) {
      return reply({ error: 'Invalid market' }).code(400);
    }

    const orders = await OrderbookApi.orders.getOrderbook(market);

    const { buy, sell } = orders;

    buy.forEach((order) => {
      delete order.owner;
      order.amount = ContractsUtil.toRealAmount(order.amount, baseCCY).toString(10);
      order.price = ContractsUtil.pricePerUnitToToken(order.price, baseCCY, counterCCY).toString(10);
    });

    sell.forEach((order) => {
      delete order.owner;
      order.amount = ContractsUtil.toRealAmount(order.amount, baseCCY).toString(10);
      order.price = ContractsUtil.pricePerUnitToToken(order.price, baseCCY, counterCCY).toString(10);
    });

    return reply({ buy, sell });
  }
}


module.exports = new GetOpenOrders();
