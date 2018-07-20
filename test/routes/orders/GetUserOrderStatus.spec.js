const sinon = require('sinon');


describe('endpoint test | GET /orders/{market}/status/{orderHash}', () => {
  const GetUserOrderStatus = require('../../../src/routes/orders/GetUserOrderStatus');
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
        password: '123456'
      }
    },
    params: {
      market: 'BASE-ETH',
      orderHash: '0x0'
    }
  };


  beforeEach(() => {
    stub(sandbox, AuthService, 'getAuthData').resolves({ token: 'token', privateKey: 'pk', userContractAddress: '0x0', email: 'test@mail.com' });
    stub(sandbox, OrderbookApi.orders, 'getOrderStatus').resolves({
      "orderHash": "0xd737f966bc24004a29f9eea48d5eb8b0accdcfb1d65402d34d33093da47569d1",
      "orderId": 6,
      "status": "FILLED",
      "type": "SELL",
      "amount": "19",
      "filled": "1",
      "price": "0.1",
      "lastFilledAmount": "1",
      "lastFilledPrice": "0.1",
      "createdAt": "2018-07-20T12:20:29.000Z",
      "updatedAt": "2018-07-20T12:20:55.000Z",
      "openAmount": "20"
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`should make a successful call`, async () => {
    // act
    await GetUserOrderStatus.handle(REQUEST, replyMock);
  });
});
