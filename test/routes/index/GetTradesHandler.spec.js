const sinon = require('sinon');

describe('endpoint test | GET /trades/{market}', () => {

  const GetTradesHandler = require('./../../../src/routes/index/GetTradesHandler');
  const OrderbookApi = require('./../../../src/api/OrderbookApi');


  /**
   * Stubs
   */
  const sandbox = sinon.sandbox.create();
  const replyMock = require('../../helpers/replyMock').init(sandbox);
  const { stub } = require('../../helpers/stubHelper');


  const REQUEST = {
    // auth
    auth: {
      credentials: {
        email: 'test@mail.com',
        OBPassword: '123456'
      }
    },
    params: {
      market: 'BASE-ETH'
    }
  };


  beforeEach(() => {
    stub(sandbox, OrderbookApi.orderbook, 'getTrades').resolves([]);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`should make a successful call`, async () => {
    // act
    await GetTradesHandler.handle(REQUEST, replyMock);
  });
});
