const {
  SERVER_PORT,
  IS_AUTH_ENABLED,
  ORDERBOOK_URL,
  USERS
} = process.env;


class BaseConfig {
  constructor() {
    this.port = SERVER_PORT || 5000;
    this.orderbookUrl = ORDERBOOK_URL || 'http://localhost:3000';
    this.isAuthEnabled = IS_AUTH_ENABLED === 'false' ? false : true;
    this.auth = IS_AUTH_ENABLED === 'true' ? 'simple' : false;
    this.users = USERS ? JSON.parse(USERS) : [];
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
    }
  }
}

module.exports = BaseConfig;
