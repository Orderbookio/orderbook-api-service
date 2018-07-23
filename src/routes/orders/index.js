const LOG = require('log4js').getLogger('orders/index.js');
const Joi = require('joi');

const config = require('./../../config/index');
const { handle } = require('./../../util/RouteHandler');

const CreateOrderHandler = require('./CreateOrderHandler');
const CancelOrderHandler = require('./CancelOrderHandler');
const GetUserOpenOrders = require('./GetUserOpenOrders');
const GetOrderbook = require('./GetOrderbook');
const GetUserOrderStatus = require('./GetUserOrderStatus');


module.exports = [
  {
    path: `${config.apiVersion1}/orders/{market}`,
    method: 'GET',
    config: {
      auth: config.auth,
      description: 'Get user open orders by market name',
      notes: 'Returns user buy and sell orders for specified market, example {\n' +
      '    "buy": [],\n' +
      '    "sell": [\n' +
      '        {\n' +
      '            "id": "10",\n' +
      '            "price": "0.5",\n' +
      '            "amount": "3",\n' +
      '            "openAmount": "3"\n' +
      '        }\n' +
      '    ]\n' +
      '}',
      tags: ['api']
    },
    handler: GetUserOpenOrders.handle
  },
  {
    path: `${config.apiVersion1}/orders/{market}/status/{orderHash}`,
    method: 'GET',
    config: {
      auth: config.auth,
      description: 'Get user order status by hash',
      notes: 'Returns user order status for specified market, example {\n' +
      '    "orderHash": "0xcf297e3c0369320ee7ea3da049ac4c2027384c79403659486f352a318e4f5699",\n' +
      '    "orderId": "198",\n' +
      '    "status": "COMPLETED",\n' +
      '    "type": "SELL",\n' +
      '    "amount": "0",\n' +
      '    "filled": "1",\n' +
      '    "price": "1.1",\n' +
      '    "lastFilledAmount": "1",\n' +
      '    "lastFilledPrice": "1.1",\n' +
      '    "createdAt": "2018-07-20T11:18:17.000Z",\n' +
      '    "updatedAt": "2018-07-20T11:18:40.000Z",\n' +
      '    "openAmount": "1",\n' +
      '}',
      tags: ['api']
    },
    handler: GetUserOrderStatus.handle
  },
  {
    path: `${config.apiVersion1}/orders`,
    method: 'POST',
    config: {
      auth: config.auth,
      description: 'Create order',
      notes: 'Returns hash of created order',
      tags: ['api'],
      validate: {
        payload: {
          type: Joi.string().required().description('order type is required'),
          amount: Joi.number().required().description('order amount is required'),
          price: Joi.number().required().description('order price is required'),
          market: Joi.string().required().description('market name is required'),
        }
      },
    },
    handler: CreateOrderHandler.handle
  },
  {
    path: `${config.apiVersion1}/orders`,
    method: 'DELETE',
    config: {
      auth: config.auth,
      description: 'Delete user order by id',
      notes: 'Returns hash of deleted order',
      tags: ['api'],
      validate: {
        payload: {
          orderId : Joi.number().required().description('order id is required'),
          market : Joi.string().required().description('market name is required'),
        }
      },
    },
    handler: CancelOrderHandler.handle
  },
  {
    path: `${config.apiVersion1}/orderbook/{market}`,
    method: 'GET',
    config: {
      auth: config.auth,
      description: 'Get open orders by market name',
      notes: 'Returns buy and sell orders for specified market, example {\n' +
      '    "buy": [],\n' +
      '    "sell": [\n' +
      '        {\n' +
      '            "price": "0.5",\n' +
      '            "amount": "3",\n' +
      '        }\n' +
      '    ]\n' +
      '}',
      tags: ['api']
    },
    handler: GetOrderbook.handle
  },
];
