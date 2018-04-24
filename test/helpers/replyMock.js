
module.exports = {
  init(sandbox) {
    const code = sandbox.stub();
    const replyMock = sandbox.stub().returns({ code });
    replyMock.code = code;

    replyMock.actual = () => (JSON.stringify(replyMock.lastCall.args[0]));
    replyMock.code.actual = () => (JSON.stringify(replyMock.code.lastCall.args[0]));

    return replyMock;
  }
};
