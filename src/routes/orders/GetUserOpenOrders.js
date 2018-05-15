const ContractsUtil = require('./../../util/ContractsUtil');

const OrderbookApi = require('./../../api/OrderbookApi');
const AuthService = require('./../../services/AuthService');


class GetUserOpenOrders {
  async handle(request, reply) {
    const market = request.params.market;

    const [, baseCCY, counterCCY] = /(\S*)-(\S*)/g.exec(market);

    const { token, proxyAddress } = await AuthService.getAuthData(request.auth.credentials);

    const orders = await OrderbookApi.orders.getOrdersByProxy(token, market, proxyAddress);

    const { buy, sell } = orders;

    buy.forEach((order) => {
      delete order.owner;
      order.amount = order.openAmount = ContractsUtil.toRealAmount(order.amount, baseCCY).toString(10);
      order.price = ContractsUtil.pricePerUnitToToken(order.price, baseCCY, counterCCY).toString(10);
    });

    sell.forEach((order) => {
      delete order.owner;
      order.amount = order.openAmount = ContractsUtil.toRealAmount(order.amount, baseCCY).toString(10);
      order.price = ContractsUtil.pricePerUnitToToken(order.price, baseCCY, counterCCY).toString(10);
    });

    return reply({ buy, sell });
  }
}


module.exports = new GetUserOpenOrders();
