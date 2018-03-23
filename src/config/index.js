const config = {
  dev: new (require('./DevConfig'))(),
  prod: new (require('./ProdConfig'))(),
  test: new (require('./TestConfig'))(),
};

module.exports = config[process.env.NODE_ENV || 'dev'];
