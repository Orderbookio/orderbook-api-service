const LOG = require('log4js').getLogger('LoginHandler.js');
const ethUtils = require('ethereumjs-util');

const OrderbookApi = require('./../../api/OrderbookApi');

class LoginHandler {
  async handle(request, reply) {
    const { email, password } = request.payload;

    const passwordHash = ethUtils.sha3(password).toString('hex');

    try {
      return reply(await OrderbookApi.auth.login(email, passwordHash));
    } catch (err) {
      if (err.response) {
        return reply(err.response.data).code(400);
      } else {
        throw new Error(err);
      }
    }
  }
}

module.exports = new LoginHandler();
