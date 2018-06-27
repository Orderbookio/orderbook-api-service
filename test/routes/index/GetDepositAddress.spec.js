const sinon = require('sinon');
const { expect } = require('chai');


describe('endpoint test | GET /assets/{asset}/deposit', () => {
  const GetDepositAddress = require('../../../src/routes/common/GetDepositAddress');
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
      asset: 'ETH'
    }
  };
  const PROXY_ADDRESS = '0x111';
  const BTC_ADDRESS = '0x222';


  beforeEach(() => {
    stub(sandbox, AuthService, 'getAuthData').resolves({
      token: 'token',
      privateKey: 'pk',
      userContractAddress: '0x0',
      email: 'test@mail.com',
      proxyAddress: PROXY_ADDRESS,
      btcDepositAddress: BTC_ADDRESS,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`should make a successful call`, async () => {
    // act
    await GetDepositAddress.handle(REQUEST, replyMock);

    //check
    expect(JSON.parse(replyMock.actual()).address).to.be.equal(PROXY_ADDRESS);
  });
});
