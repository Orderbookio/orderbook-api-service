const Joi = require('joi');
const LOG = require('log4js').getLogger('auth/index.js');

const LoginHandler = require('./LoginHandler');

module.exports = [
  {
    path: '/login',
    method: 'POST',
    config: {
      description: 'Get todo',
      notes: 'Returns a todo item by the id passed in the path',
      tags: ['api'],
      validate: {
        payload: {
          email : Joi.string().required().email().description('the id for the todo item'),
          password : Joi.string().required().description('the id for the todo item'),
        }
      },
    },
    handler: handleLogin
  }
];

/**
 *
 */
async function handleLogin(request, reply) {
  try {
    await LoginHandler.handle(request, reply);
  } catch (err) {
    LOG.warn(`/login error`, err);
    reply({ error: 'Server Error' }).code(500);
  }
}