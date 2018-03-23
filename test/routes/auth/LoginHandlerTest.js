const test = require('ava');
const server =  require('./../../../src/server');

const requestDefaults = {
  method: 'POST',
  url: '/login',
  payload: {}
};

test('endpoint test | POST /login | empty payload -> 400 Bad Request', t => {
  const request = Object.assign({}, requestDefaults);

  return server.inject(request)
    .then(response => {
      t.is(response.statusCode, 400, 'status code is 400');
    });
});