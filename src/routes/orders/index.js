const Joi = require('joi');
const LOG = require('log4js').getLogger('auth/index.js');
const config = require('./../../config/index');

const CreateOrderHandler = require('./CreateOrderHandler');
const CancelOrderHandler = require('./CancelOrderHandler');
const GetOpenOrders = require('./GetOpenOrders');


module.exports = [
  {
    path: '/orders/{market}',
    method: 'GET',
    config: {
      auth: config.auth,
      description: 'Get open orders by market name',
      notes: 'Returns a todo item by the id passed in the path',
      tags: ['api']
    },
    handler: getOpenOrders
  },
  {
    path: '/orders',
    method: 'POST',
    config: {
      auth: config.auth,
      description: 'Create order',
      notes: 'Returns a todo item by the id passed in the path',
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
    handler: createOrder
  },
  {
    path: '/orders',
    method: 'DELETE',
    config: {
      auth: config.auth,
      description: 'Delete user order by id',
      notes: 'Returns a todo item by the id passed in the path',
      tags: ['api'],
      validate: {
        payload: {
          orderId : Joi.number().required().description('order id is required'),
          market : Joi.string().required().description('market name is required'),
        }
      },
    },
    handler: cancelOrder
  }
];

async function getOpenOrders(request, reply) {
  try {
    await GetOpenOrders.handle(request, reply);
  } catch (err) {
    LOG.warn(`GET /orders/{market} error`, err);
    reply({ error: 'Server Error' }).code(500);
  }
}

async function createOrder(request, reply) {
  try {
    await CreateOrderHandler.handle(request, reply);
  } catch (err) {
    LOG.warn(`POST /orders error`, err);
    reply({ error: 'Server Error' }).code(500);
  }
}

async function cancelOrder(request, reply) {
  try {
    await CancelOrderHandler.handle(request, reply);
  } catch (err) {
    LOG.warn(`DELETE /orders error`, err);
    reply({ error: 'Server Error' }).code(500);
  }
}