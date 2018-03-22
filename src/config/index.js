const config = {
  dev: new (require('./DevConfig'))(),
  prod: new (require('./ProdConfig'))(),
};

module.exports = config[process.env.NODE_ENV || 'dev'];