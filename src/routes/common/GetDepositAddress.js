const AuthService = require('./../../services/AuthService');


class GetDepositAddress {
  async handle(request, reply) {
    const asset = request.params.asset;

    const { proxyAddress, btcDepositAddress } = await AuthService.getAuthData(request.auth.credentials);
    if (['BTCS', 'OBTC', 'BTC'].includes(asset)) {
      return reply({ address: btcDepositAddress });
    } else {
      return reply({ address: proxyAddress });
    }
  }
}


module.exports = new GetDepositAddress();
