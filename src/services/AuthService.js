const LOG = require('log4js').getLogger('AuthService.js');

const ethUtils = require('ethereumjs-util');

const LocalStorage = require('./LocalStorage');
const OrderbookApi = require('./../api/OrderbookApi');
const Encryptor = require('./../util/Encryptor');


class AuthService {
  async getAuthData(credentials) {
    const { email, OBPassword } = credentials;

    const authData = LocalStorage.getAuthData(email);
    let { token, privateKey, userContractAddress, proxyAddress } = authData;

    const res = { token, privateKey, email, userContractAddress, proxyAddress };

    let isAuthenticated = false;
    if (token) {
      const { auth } = await OrderbookApi.auth.isAuthenticated(token);
      isAuthenticated = auth === true;
    }

    if (isAuthenticated) {
      return res;
    }

    const passwordHash = ethUtils.sha3(OBPassword).toString('hex');

    let data;
    try {
      data = await OrderbookApi.auth.login(email, passwordHash);
    } catch (err) {
      LOG.warn('OB login error:', err);
      throw err;
    }

    const container = data.container;
    res.token = data.token;

    const containers = LocalStorage.getContainers();
    if (!containers[email]) { // store user container in storage
      containers[email] = container;
      await LocalStorage.setContainers(containers);
    }

    res.privateKey = Encryptor.decrypt(container, OBPassword);


    if (!userContractAddress || !proxyAddress) {
      const accountInfo = await OrderbookApi.account.getInfo(res.token);
      res.proxyAddress = accountInfo.proxyAddress;
      res.userContractAddress = accountInfo.contractAddress;
    }

    LocalStorage.setAuthData(email, res);

    return res;
  }
}


module.exports = new AuthService();
