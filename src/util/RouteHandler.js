async function handle(request, reply, handleMethod, logger, errText) {
  try {
    await handleMethod(request, reply);
  } catch (err) {
    logger.warn(errText, err);
    if (err.isFromOB) {
      reply({ ...err.response.data, ...{ from: 'Orderbook' } }).code(err.response.status);
    } else {
      reply({ error: 'Server Error', from: 'Server' }).code(500);
    }
  }
}


module.exports = {
  handle
};
