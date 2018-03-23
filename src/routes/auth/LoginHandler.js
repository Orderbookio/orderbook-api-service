const LOG = require('log4js').getLogger('LoginHandler.js');
const ethUtils = require('ethereumjs-util');

const OrderbookApi = require('./../../api/OrderbookApi');

class LoginHandler {
  async handle(request, reply) {
    const { email, password } = request.payload;

    const passwordHash = ethUtils.sha3(password).toString('hex');

    try {
      return await OrderbookApi.auth.login(email, passwordHash);
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  }
}

module.exports = new LoginHandler();
