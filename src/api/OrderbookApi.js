const axios = require('axios');
const config = require('./../config/index');

const ORDERBOOK_SERVER_URL = config.orderbookUrl;

module.exports = {
  auth: {
    login(email, password) {
      return axios.post(`${ORDERBOOK_SERVER_URL}/login`, { email, password }).then(res => res.data);
    },
  }
};