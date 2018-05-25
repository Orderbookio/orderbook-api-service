const props = require('./../../properties.json');
const {
  SERVER_PORT
} = process.env;

class BaseConfig {
  constructor() {
    this.port = SERVER_PORT || 5000;
    this.orderbookUrl = props.orderbookUrl || 'http://localhost:3000';
    this.isAuthEnabled = props.isAuthEnabled || false;
    this.auth = this.isAuthEnabled ? 'simple' : false;
    this.users = props.users || [];
    this.log4jsConfig = {
      appenders: {
        out: {
          type: 'console',
          layout: {
            type: 'pattern',
            pattern: '%[[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %c - %]%m'
          }
        },
        everything: { type: 'file', filename: 'logs/logs.log', level: 'debug' }
      },
      categories: {
        default: {
          appenders: [
            'out',
            'everything'
          ],
          level: 'debug'
        }
      }
    };
  }
}

module.exports = BaseConfig;
