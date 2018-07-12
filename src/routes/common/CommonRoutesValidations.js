const Joi = require('joi');
const ValidationsBuilder = require('./../../util/ValidationsBuilder');


class CommonRoutesValidations {
  static txStatusValidation() {
    return new ValidationsBuilder()
      .withParams({
        'hash': Joi.string().required().length(66)
      })
      .buildGET();
  }
}

module.exports = CommonRoutesValidations;
