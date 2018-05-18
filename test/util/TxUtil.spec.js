const { expect } = require('chai');
const sinon = require('sinon');


describe('util test | TxUtil', () => {

  const TxUtil = require('./../../src/util/TxUtil');
  const LocalStorage = require('./../../src/services/LocalStorage');
  const OrderbookApi = require('./../../src/api/OrderbookApi');


  /**
   * Stubs
   */
  const sandbox = sinon.sandbox.create();
  const { stub } = require('../helpers/stubHelper');

  const TOKEN = 'TOKEN';
  const EMAIL = 'test@mail.com';
  const ASSET_ADDRESS = '0x0';
  const ASSET = {
    address: ASSET_ADDRESS
  };
  const APPROVE_TXS = [
    {
      status: 'DONE',
      options: JSON.stringify({assetAddress: ASSET_ADDRESS})
    }
  ];


  beforeEach(() => {
    stub(sandbox, OrderbookApi.account, 'getBalances').resolves({});
    stub(sandbox, OrderbookApi.txs, 'getTransactionsByTypes').resolves([]);
    stub(sandbox, LocalStorage, 'getApproveTxs').returns(APPROVE_TXS);
    stub(sandbox, LocalStorage, 'setApproveTxs').returns();
    stub(sandbox, LocalStorage, 'isAutoDepositRequired').returns(false);
    stub(sandbox, LocalStorage, 'setAutoDepositRequired').returns();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(`isNeedApprove should return false`, async () => {
    // act
    const isNeedApprove = await TxUtil.isNeedApprove(TOKEN, EMAIL, ASSET);
    expect(isNeedApprove).to.be.false;
  });

  it(`isNeedApprove should return true`, async () => {
    //prepare
    stub(sandbox, LocalStorage, 'getApproveTxs').returns([]);

    // act
    const isNeedApprove = await TxUtil.isNeedApprove(TOKEN, EMAIL, ASSET);
    expect(isNeedApprove).to.be.true;
  });

  it(`isAutoDepositRequired should return true`, async () => {

    stub(sandbox, LocalStorage, 'isAutoDepositRequired').returns(true);

    const isNeedAutoDeposit = await TxUtil.isNeedAutoDeposit(TOKEN, EMAIL);
    expect(isNeedAutoDeposit).to.be.true;
  });

  it(`isAutoDepositRequired should return false`, async () => {
    // act
    const isNeedAutoDeposit = await TxUtil.isNeedAutoDeposit(TOKEN, EMAIL);
    expect(isNeedAutoDeposit).to.be.false;
  });

  it(`isAutoDepositRequired should return false`, async () => {
    // act
    const txs = [{
      status: 'DONE'
    }];
    stub(sandbox, LocalStorage, 'isAutoDepositRequired').returns(true);
    stub(sandbox, OrderbookApi.txs, 'getTransactionsByTypes').resolves(txs);

    const isNeedAutoDeposit = await TxUtil.isNeedAutoDeposit(TOKEN, EMAIL);
    expect(isNeedAutoDeposit).to.be.false;
  });
});
