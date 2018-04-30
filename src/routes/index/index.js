const LOG = require('log4js').getLogger('index.js');
const config = require('./../../config/index');

const GetUserBalancesHandler = require('./GetUserBalancesHandler');
const GetMarketsHandler = require('./GetMarketsHandler');
const GetTradesHandler = require('./GetTradesHandler');


module.exports = [
  {
    path: '/balances',
    method: 'GET',
    config: {
      auth: config.auth,
      description: 'Get user balances',
      notes: 'Get user balance by all the assets',
      tags: ['api']
    },
    handler: getUserBalances
  },
  {
    path: '/markets',
    method: 'GET',
    config: {
      description: 'Get available market names',
      notes: 'Returns an array of market names, for example  [\n' +
      '    "BASE-MONEY",\n' +
      '    "BASE-DOLLAR"\n' +
      ']',
      tags: ['api']
    },
    handler: getMarketNames
  },
  {
    path: '/trades/{market}',
    method: 'GET',
    config: {
      description: 'Get trades by market name',
      notes: 'Returns trades array by market name',
      tags: ['api']
    },
    handler: getTrades
  }
];

async function getUserBalances(request, reply) {
  try {
    await GetUserBalancesHandler.handle(request, reply);
  } catch (err) {
    LOG.warn(`/balances error`, err);
    reply({ error: 'Server Error' }).code(500);
  }
}

async function getMarketNames(request, reply) {
  try {
    await GetMarketsHandler.handle(request, reply);
  } catch (err) {
    LOG.warn(`/markets error`, err);
    reply({ error: 'Server Error' }).code(500);
  }
}

async function getTrades(request, reply) {
  try {
    await GetTradesHandler.handle(request, reply);
  } catch (err) {
    LOG.warn(`/trades error`, err);
    reply({ error: 'Server Error' }).code(500);
  }
}