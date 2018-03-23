const {
  SERVER_PORT,
} = process.env;

class BaseConfig {
  constructor() {
    this.port = SERVER_PORT || 5000;
    this.orderbookUrl = 'http://localhost:3000';
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