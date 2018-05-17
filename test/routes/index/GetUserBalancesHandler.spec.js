const sinon = require('sinon');

describe('endpoint test | GET /balances', () => {

  const GetUserBalancesHandler = require('../../../src/routes/common/GetUserBalancesHandler');
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
    }
  };


  beforeEach(() => {
    stub(sandbox, AuthService, 'getAuthData').resolves({ token: 'token', privateKey: 'pk', userContractAddress: '0x0', email: 'test@mail.com' });
    stub(sandbox, OrderbookApi.account, 'getBalances').resolves({});
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`should make a successful call`, async () => {
    // act
    await GetUserBalancesHandler.handle(REQUEST, replyMock);
  });
});
