const Hapi = require('hapi');
const path = require('path');
const fs = require('fs');
const Inert = require('inert');
const Vision = require('vision');
const AuthBasic = require('hapi-auth-basic');
const HapiSwagger = require('hapi-swagger');
const log4js = require('log4js');
const Bcrypt = require('bcrypt');

const config = require('./config/index');
const Pack = require('../package');
const users = config.users;

log4js.configure(config.log4jsConfig);

const server = new Hapi.Server();

server.connection({
  port: config.port,
  host: 'localhost'
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
  AuthBasic,
  Inert,
  Vision,
  {
    'register': HapiSwagger,
    'options': swaggerOptions
  }], (err) => {
  if (err) {
    console.log('Error register plugins:', err);
    return;
  }

  if (config.isAuthEnabled) {
    server.auth.strategy('simple', 'basic', { validateFunc: async (request, email, password, callback) => {
      const user = users.find((u) => u.email === email);
      if (!user) {
        return callback(null, false, {});
      }

      const isValid = await Bcrypt.compare(password, user.authPassword);
      const credentials = { email: user.email, OBPassword: user.OBPassword };

      return callback(null, isValid, credentials);
    } });
  }

  /**
   * Routes
   * */
  const routesPath = path.join(__dirname, 'routes');
  fs.readdirSync(routesPath).forEach((file) => {
    server.route(require(path.join(routesPath, file)));
  });

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