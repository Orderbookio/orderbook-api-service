const Hapi = require('hapi');
const path = require('path');
const fs = require('fs');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const log4js = require('log4js');

let config = require('./config/index');
const Pack = require('../package');

log4js.configure(config.log4jsConfig);

const server = new Hapi.Server();

server.connection({
  port: config.port,
  host: 'localhost'
});

/**
 * Routes
 * */
const routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach((file) => {
  server.route(require(path.join(routesPath, file)));
});


/**
 * Define plugins
 */
const swaggerOptions = {
  info: {
    title: 'Test API Documentation',
    version: Pack.version,
  },
};


server.register([
  Inert,
  Vision,
  {
    'register': HapiSwagger,
    'options': swaggerOptions
  }], (err) => {
    if (err) {
      console.log('Error register plugins:', err);
    }
});

server.start((err) => {
  if (!err) {
    console.log(`Server running at: ${server.info.uri}`);
  }
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

module.exports = server;