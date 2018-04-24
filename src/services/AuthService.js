const ethUtils = require('ethereumjs-util');
const LocalStorage = require('./LocalStorage');
const OrderbookApi = require('./../api/OrderbookApi');

class AuthService {
  async getJWTToken(credentials) {
    const { email, OBPassword } = credentials;

    const tokens = await LocalStorage.getTokens();
    let authToken = tokens[email];

    let isAuthenticated = false;
    if (authToken) {
      const { auth } = await OrderbookApi.auth.isAuthenticated(authToken);
      isAuthenticated = auth === true;
    }

    if (!isAuthenticated) {
      const passwordHash = ethUtils.sha3(OBPassword).toString('hex');
      const data = await OrderbookApi.auth.login(email, passwordHash);
      const { token, container } = data;

      tokens[email] = token;
      await LocalStorage.setTokens(tokens);

      const containers = LocalStorage.getContainers();
      if (!containers[email]) {
        containers[email] = container;
        await LocalStorage.setContainers(containers);
      }

      return token;
    } else {
      return authToken;
    }
  }
}

module.exports = new AuthService();