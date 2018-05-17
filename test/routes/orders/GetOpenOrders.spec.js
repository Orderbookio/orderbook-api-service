const sinon = require('sinon');

describe('endpoint test | GET /orders/{market}', () => {

  const GetOpenOrders = require('../../../src/routes/orders/GetUserOpenOrders');
  const OrderbookApi = require('./../../../src/api/OrderbookApi');
  const AuthService = require('./../../../src/services/AuthService');


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
    stub(sandbox, AuthService, 'getAuthData').resolves({ token: 'token', privateKey: 'pk', userContractAddress: '0x0', email: 'test@mail.com' });
    stub(sandbox, OrderbookApi.orders, 'getOrdersByProxy').resolves({ buy: [], sell: []});
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`should make a successful call`, async () => {
    // act
    await GetOpenOrders.handle(REQUEST, replyMock);
  });
});
