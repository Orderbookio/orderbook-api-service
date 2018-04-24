const Joi = require('joi');
const LOG = require('log4js').getLogger('index.js');
const config = require('./../../config/index');

const GetUserBalancesHandler = require('./GetUserBalancesHandler');


module.exports = [
  {
    path: '/',
    method: 'GET',
    config: {
      auth: config.auth,
      description: 'Get todo',
      notes: 'Returns a todo item by the id passed in the path',
      tags: ['api'],
      validate: {
        params: {
          id : Joi.number()
            .description('the id for the todo item'),
        }
      },
    },
    handler: (request, reply) => {
      LOG.info(`Requested index route`);
      LOG.warn(`Requested index route`);
      LOG.error(`Requested index route`);
      reply('Hello, world!');
    }
  },
  {
    path: '/balances',
    method: 'GET',
    config: {
      auth: config.auth,
      description: 'Get user balances',
      notes: 'Returns a todo item by the id passed in the path',
      tags: ['api']
    },
    handler: getUserBalances
  }
];

/**
 *
 */
async function getUserBalances(request, reply) {
  try {
    await GetUserBalancesHandler.handle(request, reply);
  } catch (err) {
    LOG.warn(`/balances error`, err);
    reply({ error: 'Server Error' }).code(500);
  }
}