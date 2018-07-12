const Joi = require('joi');


const failAction = (request, reply, source, error) => {
  return reply({ error: error.output.payload.message }).code(400);
};

class ValidationsBuilder {
  constructor() {
    this.payload = {};
    this.params = {};
    this.query = {};
  }

  withPayload(payload) {
    this.payload = Object.assign(this.payload, payload);
    return this;
  }

  withParams(params) {
    this.params = Object.assign(this.params, params);
    return this;
  }

  withQuery(q) {
    this.query = Object.assign(this.query, q);
    return this;
  }

  withNonce() {
    this.payload.nonce = Joi.alternatives().try([
      Joi.string().required().min(1).max(14),
      Joi.number().required().min(1).max(Number.MAX_SAFE_INTEGER)
    ]);
    return this;
  }

  withPrice() {
    this.payload.price = Joi.string().required().min(1).max(65);
    return this;
  }

  withAmount() {
    this.payload.amount = Joi.string().required().min(1).max(65);
    return this;
  }

  withSignedTx() {
    this.payload.v = Joi.number().required().min(10).max(99);
    this.payload.r = Joi.string().required().length(66); //todo Tanya please check that r, s, op params have specified length.
    this.payload.s = Joi.string().required().length(66);
    this.payload.op = Joi.string().required().length(66);
    return this;
  }

  withMarket() {
    this.payload.market = Joi.string().required().min(5).max(20);
    return this;
  }

  withEmail() {
    this.payload.email = Joi.string().min(5).max(100).email().required();
    return this;
  }

  withPassword() {
    this.payload.password = Joi.string().min(6).max(100).required();
    return this;
  }

  withCountry() {
    this.payload.country = Joi.string().max(50);
    return this;
  }

  withPhone() {
    this.payload.phone = Joi.string().empty('').max(50);
    return this;
  }

  build() {
    return {
      params: this.params,
      payload: this.payload,
      failAction
    };
  }

  buildGET() {
    return {
      params: this.params,
      query: this.query,
      failAction
    };
  }
}

module.exports = ValidationsBuilder;
