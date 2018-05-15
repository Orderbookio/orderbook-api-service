const BaseConfig = require('./BaseConfig');

class ProdConfig extends BaseConfig {
  constructor() {
    super();

    this.orderbookUrl = 'https://api.orderbook.io';
  }
}

module.exports = ProdConfig;
