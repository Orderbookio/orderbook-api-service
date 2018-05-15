const LOG = require('log4js').getLogger('common/index.js');
const config = require('./../../config/index');
const { handle } = require('./../../util/RouteHandler');

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
    handler: (rt, rp) => handle(rt, rp, GetUserBalancesHandler.handle, LOG, 'GET /balances error')
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
    handler: (rt, rp) => handle(rt, rp, GetMarketsHandler.handle, LOG, 'GET /markets error')
  },
  {
    path: '/trades/{market}',
    method: 'GET',
    config: {
      description: 'Get trades by market name',
      notes: 'Returns trades array by market name',
      tags: ['api']
    },
    handler: (rt, rp) => handle(rt, rp, GetTradesHandler.handle, LOG, 'GET /trades error')
  }
];
