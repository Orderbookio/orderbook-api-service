const axios = require('axios');
const config = require('./../config/index');

const ORDERBOOK_SERVER_URL = config.orderbookUrl;

function getAuthHeader(authToken) {
  return {
    headers: {
      Authorization: authToken
    }
  };
}

module.exports = {
  auth: {
    login(email, password) {
      return axios.post(`${ORDERBOOK_SERVER_URL}/login`, { email, password }).then(res => res.data);
    },

    isAuthenticated(authToken) {
      return axios.get(`${ORDERBOOK_SERVER_URL}/isAuthenticated`, getAuthHeader(authToken)).then(res => res.data);
    },
  },
  account : {
    getBalances(authToken, assets = []) {
      return axios.get(`${ORDERBOOK_SERVER_URL}/account/balances?assets=${assets.join(',')}`, getAuthHeader(authToken)).then(res => res.data);
    }
  }
};