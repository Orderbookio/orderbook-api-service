const { expect } = require('chai');


module.exports = {
  stub(sandbox, obj, functionName) {
    // check if already wrapped
    if (obj[functionName] && obj[functionName].addBehavior) {
      return obj[functionName];
    }

    // wrap
    return sandbox.stub(obj, functionName);
  },

  shouldBeCalled(stub) {
    expect(stub.called).to.be.true;
  },

  shouldNotBeCalled(stub) {
    expect(stub.notCalled).to.be.true;
  },

  throwInvalidState() {
    throw new Error('Invalid state');
  }
};
