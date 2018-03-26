const { expect } = require('chai');

const server =  require('./../../../src/server');

const requestDefaults = {
  method: 'POST',
  url: '/login',
  payload: {}
};

describe('endpoint test | POST /login', () => {
  it('empty payload -> 400 Bad Request', () => {
    const request = Object.assign({}, requestDefaults);

    return server.inject(request)
      .then(response => {
        expect(response.statusCode).to.be.equal(400);
      });
  });
});
