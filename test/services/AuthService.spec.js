const { expect } = require('chai');
const sinon = require('sinon');


describe('test AuthService', () => {
  const AuthService = require('./../../src/services/AuthService');
  const LocalStorage = require('./../../src/services/LocalStorage');
  const OrderbookApi = require('./../../src/api/OrderbookApi');

  /**
   * Stubs
   */
  const sandbox = sinon.sandbox.create();
  const { stub, shouldBeCalled, shouldNotBeCalled } = require('../helpers/stubHelper');


  const CREDENTIALS = {
    email: 'test@mail.com',
    password: '123456'
  };

  const JWTTokenInLocalStorage = 'TOKEN_FROM_LOCAL_STORAGE';
  const JWTTokenFromOB = 'TOKEN_FROM_OB';

  const AUTH_DATA = {
    token: JWTTokenInLocalStorage,
    privateKey: 'USER_PK'
  };


  beforeEach(() => {
    stub(sandbox, OrderbookApi.auth, 'login').resolves({ token: JWTTokenFromOB, container: {} });
    stub(sandbox, OrderbookApi.auth, 'isAuthenticated').resolves({ auth: true });
    stub(sandbox, OrderbookApi.account, 'getInfo').resolves({ proxyAddress: '0x0', contractAddress: '0x0' });
    stub(sandbox, LocalStorage, 'getAuthData').returns(AUTH_DATA);
    stub(sandbox, LocalStorage, 'setAuthData').resolves();
    stub(sandbox, LocalStorage, 'getContainers').resolves({});
    stub(sandbox, LocalStorage, 'setContainers').resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`should make a successful call`, async () => {
    // act
    await AuthService.getAuthData(CREDENTIALS);
  });

  it(`getJWTToken should return JWT token form LocalStorage`, async () => {
    // act
    const { token } = await AuthService.getAuthData(CREDENTIALS);
    expect(token).to.be.equal(JWTTokenInLocalStorage);
  });

  it(`getJWTToken should return JWT token form Orderbook`, async () => {
    //prepare data
    stub(sandbox, LocalStorage, 'getAuthData').resolves({});

    // act
    const { token } = await AuthService.getAuthData(CREDENTIALS);

    shouldNotBeCalled(OrderbookApi.auth.isAuthenticated);
    expect(token).to.be.equal(JWTTokenFromOB);
  });
});
