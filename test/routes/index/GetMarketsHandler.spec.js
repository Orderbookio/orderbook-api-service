const sinon = require('sinon');

describe('endpoint test | GET /markets', () => {

  const GetMarketsHandler = require('./../../../src/routes/index/GetMarketsHandler');
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
    }
  };


  beforeEach(() => {
    stub(sandbox, OrderbookApi.orderbook, 'getMarkets').resolves([]);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`should make a successful call`, async () => {
    // act
    await GetMarketsHandler.handle(REQUEST, replyMock);
  });
});
