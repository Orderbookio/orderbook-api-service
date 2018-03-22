const Joi = require('joi');
const LOG = require('log4js').getLogger('index.js');

module.exports = [
  {
    path: '/{id}',
    method: 'GET',
    config: {
      description: 'Get todo',
      notes: 'Returns a todo item by the id passed in the path',
      tags: ['api'], // ADD THIS TAG
      validate: {
        params: {
          id : Joi.number()
            .description('the id for the todo item'),
        }
      },
    },
    handler: (request, h) => {
      LOG.info(`Requested index route`);
      LOG.warn(`Requested index route`);
      LOG.error(`Requested index route`);
      return 'Hello, world!';
    }
  }
];