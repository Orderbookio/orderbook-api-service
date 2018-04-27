const ethUtils = require('ethereumjs-util');
const LocalStorage = require('./LocalStorage');
const OrderbookApi = require('./../api/OrderbookApi');
const Encryptor = require('./../util/Encryptor');

class AuthService {
  async getAuthData(credentials) {
    const { email, OBPassword, proxyAddress, userContractAddress } = credentials;

    const authData = LocalStorage.getAuthData(email);
    let { token, privateKey } = authData;

    let isAuthenticated = false;
    if (token) {
      const { auth } = await OrderbookApi.auth.isAuthenticated(token);
      isAuthenticated = auth === true;
    }

    if (isAuthenticated) {
      return { token, privateKey, proxyAddress, userContractAddress }
    }

    const passwordHash = ethUtils.sha3(OBPassword).toString('hex');
    const data = await OrderbookApi.auth.login(email, passwordHash);
    const  container = data.container;
    token = data.token;

    const containers = LocalStorage.getContainers();
    if (!containers[email]) {
      containers[email] = container;
      await LocalStorage.setContainers(containers);
    }

    privateKey = Encryptor.decrypt(container, OBPassword);

    LocalStorage.setAuthData(email, { token, privateKey });

    return { token, privateKey, proxyAddress, userContractAddress };
  }
}

module.exports = new AuthService();