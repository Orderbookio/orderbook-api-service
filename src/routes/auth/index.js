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
          email : Joi.string().email().description('the id for the todo item'),
          password : Joi.string().description('the id for the todo item'),
        }
      },
    },
    handler: handleLogin
  }
];

/**
 *
 */
async function handleLogin(request, h) {
  try {
    return await LoginHandler.handle(request, h);
  } catch (err) {
    LOG.warn(`/login error`, err);
    return h.response({ error: 'Server Error' }).code(500);
  }
}