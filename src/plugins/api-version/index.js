const Boom = require('boom');
const Joi = require('joi');

const Package = require('./../../../package');

const internals = {
  optionsSchema: Joi.object({
    validVersions: Joi.array().items(Joi.number().integer()).min(1).required(),
    defaultVersion: Joi.any().valid(Joi.ref('validVersions')).required(),
    basePath: Joi.string().trim().min(1).default('/')
  })
};

const _extractVersionFromPath = function (request) {
  const path = request.path;
  if ((/v[0-9]/).test(path)) {
    const version = path.slice(2, '/v1/'.length - 1);
    return parseInt(version);
  }
};

exports.register = function (server, options, next) {
  const validateOptions = Joi.validate(options, internals.optionsSchema, { abortEarly: false, allowUnknown: false });

  if (validateOptions.error) {
    return next(validateOptions.error);
  }

  // Use the validated and maybe converted values from Joi
  options = validateOptions.value;

  server.ext('onRequest', (request, reply) => {

    let pathVersion = _extractVersionFromPath(request);
    let path = request.path;
    if (pathVersion) {
      path = path.slice(3);
    }

    // If there was a version by now check if it is valid
    if (pathVersion && !options.validVersions.includes(pathVersion)) {
      return reply(Boom.create(options.invalidVersionErrorCode, 'Invalid api-version. Valid values: ' + options.validVersions.join(',')));
    }

    // If there was no version by now use the default version
    let useDefault = false;
    if (!pathVersion) {
      pathVersion = options.defaultVersion;
      useDefault = true;
    }

    const versionedPath = options.basePath + 'v' + pathVersion + path;
    let route = server.match(request.method, versionedPath);

    if (!route) {
      route = server.match(request.method, path);
    } else {
      path = versionedPath;
    }

    if (route) {
      request.setUrl(path);

      //Set version for usage in handler
      request.plugins['apiVersion1'] = {
        apiVersion: pathVersion,
        useDefault
      };
    }

    return reply.continue();
  });

  return next();
};

exports.register.attributes = {
  name: Package.name,
  version: Package.version,
  multiple: true
};