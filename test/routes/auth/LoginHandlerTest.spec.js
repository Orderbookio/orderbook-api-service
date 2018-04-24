const { expect } = require('chai');
const sinon = require('sinon');

describe('endpoint test | POST /login', () => {

  const LoginHandler = require('./../../../src/routes/auth/LoginHandler');
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
    stub(sandbox, OrderbookApi.auth, 'login').resolves({ token: 'token', container: {} });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`should make a successful call`, async () => {
    // act
    await LoginHandler.handle(REQUEST, replyMock);
  });
});
