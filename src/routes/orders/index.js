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
      tags: ['api'],
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
      // validate: {
      //   payload: {
      //     email : Joi.string().required().email().description('the id for the todo item'),
      //     password : Joi.string().required().description('the id for the todo item'),
      //   }
      // },
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
      tags: ['api']
    },
    handler: cancelOrder
  }
];

/**
 *
 */
async function getOpenOrders(request, reply) {
  try {
    await GetOpenOrders.handle(request, reply);
  } catch (err) {
    LOG.warn(`GET /orders/{market} error`, err);
    reply({ error: 'Server Error' }).code(500);
  }
}

/**
 *
 */
async function createOrder(request, reply) {
  try {
    await CreateOrderHandler.handle(request, reply);
  } catch (err) {
    LOG.warn(`POST /orders error`, err);
    reply({ error: 'Server Error' }).code(500);
  }
}

/**
 *
 */
async function cancelOrder(request, reply) {
  try {
    await CancelOrderHandler.handle(request, reply);
  } catch (err) {
    LOG.warn(`DELETE /orders error`, err);
    reply({ error: 'Server Error' }).code(500);
  }
}