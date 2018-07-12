const config = require('./../../config/index');

const CommonRoutesValidations = require('./CommonRoutesValidations');
const GetUserBalancesHandler = require('./GetUserBalancesHandler');
const GetMarketsHandler = require('./GetMarketsHandler');
const GetTradesHandler = require('./GetTradesHandler');
const GetTransactionStatusHandler = require('./GetTransactionStatusHandler');


module.exports = [
  {
    path: `${config.apiVersion1}/balances`,
    method: 'GET',
    config: {
      auth: config.auth,
      description: 'Get user balances',
      notes: 'Get user balance by all the assets',
      tags: ['api']
    },
    handler: GetUserBalancesHandler.handle
  },
  {
    path: `${config.apiVersion1}/markets`,
    method: 'GET',
    config: {
      description: 'Get available market names',
      notes: 'Returns an array of market names, for example  [\n' +
      '    "BASE-MONEY",\n' +
      '    "BASE-DOLLAR"\n' +
      ']',
      tags: ['api']
    },
    handler: GetMarketsHandler.handle
  },
  {
    path: `${config.apiVersion1}/trades/{market}`,
    method: 'GET',
    config: {
      description: 'Get trades by market name',
      notes: 'Returns trades array by market name',
      tags: ['api']
    },
    handler: GetTradesHandler.handle
  },
  {
    path: `${config.apiVersion1}/transaction/{hash}/status`,
    method: 'GET',
    config: {
      description: 'Get transaction status by hash',
      notes: 'Returns an object with tx status (PENDING, DONE, FAILED) and tx creation timestamp {\n' +
      '    "status" : "PENDING",\n' +
      '    "timestamp" : "1529408450546"\n' +
      '}',
      tags: ['api'],
      validate: CommonRoutesValidations.txStatusValidation()
    },
    handler: GetTransactionStatusHandler.handle
  }
];
