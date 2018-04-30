const {
  SERVER_PORT,
  IS_AUTH_ENABLED,
  ORDERBOOK_URL,
  USERS
} = process.env;

class BaseConfig {
  constructor() {
    this.port = SERVER_PORT || 5000;
    this.orderbookUrl = 'http://localhost:3000' || ORDERBOOK_URL;
    this.isAuthEnabled = IS_AUTH_ENABLED || false;
    this.auth = IS_AUTH_ENABLED ? 'simple' : false;
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