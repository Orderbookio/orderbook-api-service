const sinon = require('sinon');
const { assert } = require('chai');


describe('endpoint test | POST /orders', () => {
  const CreateOrderHandler = require('./../../../src/routes/orders/CreateOrderHandler');
  const OrderbookApi = require('./../../../src/api/OrderbookApi');
  const AuthService = require('./../../../src/services/AuthService');
  const LocalStorage = require('./../../../src/services/LocalStorage');
  const Signer = require('./../../../src/util/Signer');
  const TxUtil = require('./../../../src/util/TxUtil');


  /**
   * Stubs
   */
  const sandbox = sinon.sandbox.create();
  const replyMock = require('../../helpers/replyMock').init(sandbox);
  const { stub, shouldBeCalled, shouldNotBeCalled  } = require('../../helpers/stubHelper');

  const REQUEST = {
    // auth
    auth: {
      credentials: {
        email: 'test@mail.com',
        OBPassword: '123456'
      }
    },
    payload: {
      type: 'sell',
      market: 'BASE-ETH',
      amount: 1,
      price: 1
    }
  };


  beforeEach(() => {
    stub(sandbox, AuthService, 'getAuthData').resolves({ token: 'token', privateKey: 'pk', userContractAddress: '0x0', email: 'test@mail.com' });
    stub(sandbox, OrderbookApi.account, 'getBalances').resolves({});
    stub(sandbox, OrderbookApi.account, 'getNonce').resolves(1);
    stub(sandbox, OrderbookApi.orders, 'create').resolves({});
    stub(sandbox, Signer, 'prepareOperation').resolves({});
    stub(sandbox, LocalStorage, 'getAssets').returns({ BASE: {} });
    stub(sandbox, TxUtil, 'isNeedApprove').returns(false);
    stub(sandbox, TxUtil, 'isNeedAutoDeposit').returns(false);
    stub(sandbox, TxUtil, 'setAutoDeposit').resolves();
    stub(sandbox, TxUtil, 'approve').resolves();
    stub(sandbox, LocalStorage, 'getOBContract').returns({
      address: '0x0', contract: {
        submitSellOrder: {
          getData: () => {}
        },
        submitBuyOrder: {
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
    await CreateOrderHandler.handle(REQUEST, replyMock);
    shouldBeCalled(OrderbookApi.orders.create);
  });

  it(`should call approve whet it required`, async () => {
    //prepare
    stub(sandbox, TxUtil, 'isNeedApprove').returns(true);

    // act
    await CreateOrderHandler.handle(REQUEST, replyMock);
    shouldBeCalled(TxUtil.approve);
    shouldBeCalled(OrderbookApi.orders.create);
  });

  it(`should call setAutoDeposit for market with ETH counter ccy`, async () => {
    //prepare
    stub(sandbox, TxUtil, 'isNeedAutoDeposit').returns(true);
    const request = Object.assign({}, REQUEST);
    request.payload.market = 'BASE-ETH';
    request.payload.type = 'sell';

    // act
    await CreateOrderHandler.handle(request, replyMock);
    shouldBeCalled(TxUtil.setAutoDeposit);
    shouldBeCalled(OrderbookApi.orders.create);
  });

  it(`should call setAutoDeposit for market with ETH base ccy`, async () => {
    //prepare
    stub(sandbox, TxUtil, 'isNeedAutoDeposit').returns(true);
    const request = Object.assign({}, REQUEST);
    request.payload.market = 'ETH-BASE';
    request.payload.type = 'buy';

    // act
    await CreateOrderHandler.handle(request, replyMock);
    shouldBeCalled(TxUtil.setAutoDeposit);
    shouldBeCalled(OrderbookApi.orders.create);
  });

  it(`should return 400 error 'Invalid order type'`, async () => {
    //prepare
    const request = Object.assign({}, REQUEST);
    request.payload.type = 'unknown';
    const invalidTypeResponse = { 'error': 'Invalid order type'};
    const invalidTypeCode = 400;

    // act
    await CreateOrderHandler.handle(REQUEST, replyMock);

    shouldNotBeCalled(OrderbookApi.orders.create);
    assert(replyMock.calledWith(invalidTypeResponse), `replyMock should be called with object: ${JSON.stringify(invalidTypeResponse)}, actual: ${replyMock.actual()}`);
    assert(replyMock.code.calledWith(invalidTypeCode), `replyMock.code should be called with code ${invalidTypeCode}, actual: ${replyMock.code.actual()}`);
  });

  it(`should return 400 error 'Invalid market, assetSymbol not found'`, async () => {
    //prepare
    const request = Object.assign({}, REQUEST);
    const assetSymbol = 'XXX';
    request.payload.market = `${assetSymbol}-ETH`;
    request.payload.type = 'sell';
    const invalidMarketResponse = { 'error': `Invalid market, ${assetSymbol} not found`};
    const invalidMarketCode = 400;

    // act
    await CreateOrderHandler.handle(request, replyMock);

    shouldNotBeCalled(OrderbookApi.orders.create);
    assert(replyMock.calledWith(invalidMarketResponse), `replyMock should be called with object: ${JSON.stringify(invalidMarketResponse)}, actual: ${replyMock.actual()}`);
    assert(replyMock.code.calledWith(invalidMarketCode), `replyMock.code should be called with code ${invalidMarketCode}, actual: ${replyMock.code.actual()}`);
  });
});
