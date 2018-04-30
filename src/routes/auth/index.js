const LOG = require('log4js').getLogger('auth/index.js');
const config = require('./../../config/index');

const LoginHandler = require('./LoginHandler');


module.exports = [
  {
    path: '/login',
    method: 'POST',
    config: {
      auth: config.auth
    },
    handler: handleLogin
  }
];

async function handleLogin(request, reply) {
  try {
    await LoginHandler.handle(request, reply);
  } catch (err) {
    LOG.warn(`/login error`, err);
    reply({ error: 'Server Error' }).code(500);
  }
}