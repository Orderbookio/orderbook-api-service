const LOG = require('log4js').getLogger('orders/index.js');
const Joi = require('joi');

const config = require('./../../config/index');
const { handle } = require('./../../util/RouteHandler');

const CreateOrderHandler = require('./CreateOrderHandler');
const CancelOrderHandler = require('./CancelOrderHandler');
const GetUserOpenOrders = require('./GetUserOpenOrders');
const GetOrderbook = require('./GetOrderbook');


module.exports = [
  {
    path: '/orders/{market}',
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
    handler: (rt, rp) => handle(rt, rp, GetUserOpenOrders.handle, LOG, 'GET /orders/{market} error')
  },
  {
    path: '/orders',
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
    handler: (rt, rp) => handle(rt, rp, CreateOrderHandler.handle, LOG, 'POST /orders error')
  },
  {
    path: '/orders',
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
    handler: (rt, rp) => handle(rt, rp, CancelOrderHandler.handle, LOG, 'DELETE /orders error')
  },
  {
    path: '/orderbook/{market}',
    method: 'GET',
    config: {
      auth: config.auth,
      description: 'Get open orders by market name',
      notes: 'Returns user buy and sell orders for specified market, example {\n' +
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
    handler: (rt, rp) => handle(rt, rp, GetOrderbook.handle, LOG, 'GET /orederbook/{market} error')
  },
];
