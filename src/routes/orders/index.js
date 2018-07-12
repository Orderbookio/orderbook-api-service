const LOG = require('log4js').getLogger('orders/index.js');
const Joi = require('joi');

const config = require('./../../config/index');

const CreateOrderHandler = require('./CreateOrderHandler');
const CancelOrderHandler = require('./CancelOrderHandler');
const GetUserOpenOrders = require('./GetUserOpenOrders');
const GetOrderbook = require('./GetOrderbook');


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
