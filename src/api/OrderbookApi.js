const axios = require('axios');

const config = require('./../config/index');


class OrderbookApi {
  constructor() {
    const ORDERBOOK_SERVER_URL = config.orderbookUrl;

    const getAuthHeader = (authToken) => {
      return {
        headers: {
          Authorization: authToken
        }
      };
    };

    const handleOBError = (err) => {
      err.isFromOB = true;
      throw err;
    };

    this.orderbook = {
      getMarkets() {
        return axios.get(`${ORDERBOOK_SERVER_URL}/markets`).then(res => res.data.markets).catch(handleOBError);
      },

      getTrades(market) {
        return axios.get(`${ORDERBOOK_SERVER_URL}/markets/${encodeURIComponent(market)}/trades`).then(res => res.data).catch(handleOBError);
      },

      getContractByVer(ver = 'latest') {
        return axios.get(`${ORDERBOOK_SERVER_URL}/info/ob-contract/${ver}`).then(res => res.data).catch(handleOBError);
      }
    };

    this.auth = {
      login(email, password) {
        return axios.post(`${ORDERBOOK_SERVER_URL}/auth/login`, { email, password }).then(res => res.data).catch(handleOBError);
      },

      isAuthenticated(authToken) {
        return axios.get(`${ORDERBOOK_SERVER_URL}/auth/check-token`, getAuthHeader(authToken)).then(res => res.data).catch(handleOBError);
      },
    };

    this.account = {
      getInfo(authToken) {
        return axios.get(`${ORDERBOOK_SERVER_URL}/account/info`, getAuthHeader(authToken))
          .then(res => res.data)
          .catch(handleOBError);
      },

      getBalances(authToken, assets = []) {
        return axios.get(`${ORDERBOOK_SERVER_URL}/account/balance?assets=${assets.join(',')}`, getAuthHeader(authToken))
          .then(res => res.data)
          .catch(handleOBError);
      },

      getNonce(authToken) {
        return axios.get(`${ORDERBOOK_SERVER_URL}/submit/nonce`, getAuthHeader(authToken)).then(res => res.data.nonce).catch(handleOBError);
      },

      getAllowance(authToken, targetContractAddress, approveAddress) {
        return axios.post(`${ORDERBOOK_SERVER_URL}/account/allowance`, { targetContractAddress, approveAddress }, getAuthHeader(authToken))
          .then(res => res.data.allowance)
          .catch(handleOBError);
      },

      approve(authToken, assetSymbol, approveAddress, targetContractAddress,  nonce, op, sig) {
        const { v, r, s } = sig;
        return axios.post(`${ORDERBOOK_SERVER_URL}/submit/approve-any`, { assetSymbol, approveAddress, targetContractAddress, nonce, op, v, r, s }, getAuthHeader(authToken))
          .then(res => res.data)
          .catch(handleOBError);
      },

      setAutoDeposit(authToken, ethAssetAddress, nonce, op, sig) {
        const { v, r, s } = sig;
        return axios.post(`${ORDERBOOK_SERVER_URL}/submit/set-auto-deposit`, { ethAssetAddress, nonce, op, v, r, s }, getAuthHeader(authToken))
          .then(res => res.data)
          .catch(handleOBError);
      },
    };

    this.orders = {
      create(authToken, method, market, price, amount, nonce, sig, op) {
        const { v, r, s } = sig;

        return axios.post(`${ORDERBOOK_SERVER_URL}/submit/order`, { method, market, price, amount, nonce, v, r, s, op }, getAuthHeader(authToken))
          .then(res => res.data)
          .catch(handleOBError);
      },

      cancelOrder(authToken, market, orderId, nonce, sig, op) {
        const { v, r, s } = sig;

        return axios.post(`${ORDERBOOK_SERVER_URL}/submit/cancel-order`, { market, orderId, nonce, v, r, s, op }, getAuthHeader(authToken))
          .then(res => res.data)
          .catch(handleOBError);
      },

      getUserOpenOrders(authToken, market) {
        return axios.get(`${ORDERBOOK_SERVER_URL}/markets/${encodeURIComponent(market)}/user-orders`, getAuthHeader(authToken))
          .then(res => res.data)
          .catch(handleOBError);
      },

      getOrderbook(market) {
        return axios.get(`${ORDERBOOK_SERVER_URL}/markets/${encodeURIComponent(market)}/orders`)
          .then(res => res.data)
          .catch(handleOBError);
      },

      getOrderStatus(authToken, market, hash) {
        return axios.get(`${ORDERBOOK_SERVER_URL}/markets/${encodeURIComponent(market)}/user-orders-v2/${encodeURIComponent(hash)}`, getAuthHeader(authToken))
          .then(res => res.data)
          .catch(handleOBError);
      },
    };

    this.txs = {
      getTransactionsByTypes(authToken, types) {
        return axios.get(`${ORDERBOOK_SERVER_URL}/account/transactions`, ({ ...{ params: { types } }, ...getAuthHeader(authToken) }))
          .then(res => res.data)
          .catch(handleOBError);
      }
    };

    this.assets = {
      getAssets() {
        return axios.get(`${ORDERBOOK_SERVER_URL}/assets`).then(res => res.data)
          .then((data) => data.reduce((map, obj) => {
            map[obj.symbol] = obj;
            return map;
          }, {}))
          .catch(handleOBError);
      }
    };
  }
}


module.exports = new OrderbookApi();
