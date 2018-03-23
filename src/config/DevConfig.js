const BaseConfig = require('./BaseConfig');

class DevConfig extends BaseConfig {
  constructor() {
    super();

    this.orderbookUrl = 'http://localhost:3000';
  }
}

module.exports = DevConfig;