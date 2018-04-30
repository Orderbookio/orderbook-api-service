const sinon = require('sinon');

describe('endpoint test | DELETE /orders', () => {

  const CancelOrderHandler = require('./../../../src/routes/orders/CancelOrderHandler');
  const OrderbookApi = require('./../../../src/api/OrderbookApi');
  const AuthService = require('./../../../src/services/AuthService');
  const LocalStorage = require('./../../../src/services/LocalStorage');
  const Signer = require('./../../../src/util/Signer');


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
    payload: {
      orderId: 1,
      market: 'BASE-ETH'
    }
  };


  beforeEach(() => {
    stub(sandbox, AuthService, 'getAuthData').resolves({ token: 'token', privateKey: 'pk', userContractAddress: '0x0', email: 'test@mail.com' });
    stub(sandbox, OrderbookApi.account, 'getBalances').resolves({});
    stub(sandbox, OrderbookApi.account, 'getNonce').resolves(1);
    stub(sandbox, OrderbookApi.orders, 'cancelOrder').resolves({});
    stub(sandbox, Signer, 'prepareOperation').resolves({});
    stub(sandbox, LocalStorage, 'getOBContract').returns({
      address: '0x0', contract: {
        cancelOrder: {
          getData: () => {}
        }
      }
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`should make a successful call`, async () => {
    // act
    await CancelOrderHandler.handle(REQUEST, replyMock);
  });
});