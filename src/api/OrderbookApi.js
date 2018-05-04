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
  orderbook: {
    getMarkets() {
      return axios.get(`${ORDERBOOK_SERVER_URL}/markets`).then(res => res.data.markets);
    },
    getTrades(market) {
      return axios.get(`${ORDERBOOK_SERVER_URL}/markets/${encodeURIComponent(market)}/trades`).then(res => res.data);
    },
    getContractByVer(ver = 'latest') {
      return axios.get(`${ORDERBOOK_SERVER_URL}/contract/${ver}`).then(res => res.data);
    },
  },
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
    },
    getNonce(authToken) {
      return axios.get(`${ORDERBOOK_SERVER_URL}/nonce`, getAuthHeader(authToken)).then(res => res.data.nonce);
    },
    getAllowance(authToken, assetSymbol) {
      return axios.get(`${ORDERBOOK_SERVER_URL}/account/${encodeURIComponent(assetSymbol)}/allowance`, getAuthHeader(authToken))
        .then(res => res.data);
    },
    approve(authToken, assetSymbol, assetAddress, nonce, op, sig) {
      const { v, r, s } = sig;
      return axios.post(`${ORDERBOOK_SERVER_URL}/submit/approve`, { assetSymbol, assetAddress, nonce, op, v, r, s }, getAuthHeader(authToken))
        .then(res => res.data);
    },
  },
  orders: {
    create(authToken, method, market, price, amount, nonce, sig, op) {
      const { v, r, s } = sig;

      return axios.post(`${ORDERBOOK_SERVER_URL}/submit/order`, { method, market, price, amount, nonce, v, r, s, op }, getAuthHeader(authToken))
        .then(res => res.data);
    },
    cancelOrder(authToken, market, orderId, nonce, sig, op) {
      const { v, r, s } = sig;

      return axios.post(`${ORDERBOOK_SERVER_URL}/submit/cancel-order`, { market, orderId, nonce, v, r, s, op }, getAuthHeader(authToken))
        .then(res => res.data);
    },
    getOrdersByProxy(authToken, market, address) {
      return axios.get(`${ORDERBOOK_SERVER_URL}/markets/${encodeURIComponent(market)}/orders/${address}`, getAuthHeader(authToken)).then(res => res.data);
    },
    getOrderbook(market) {
      return axios.get(`${ORDERBOOK_SERVER_URL}/markets/${encodeURIComponent(market)}`).then(res => res.data);
    },
  },
  txs: {
    getTransactionsByTypes(authToken, types) {
      return axios.get(`${ORDERBOOK_SERVER_URL}/transactions`, ({ ...{ params: { types } }, ...getAuthHeader(authToken) })).then(res => res.data);
    }
  },
  assets: {
    getAssets() {
      return axios.get(`${ORDERBOOK_SERVER_URL}/assets`).then(res => res.data)
        .then((data) => data.reduce((map, obj) => {
          map[obj.symbol] = obj;
          return map;
        }, {}));
    }
  }
};