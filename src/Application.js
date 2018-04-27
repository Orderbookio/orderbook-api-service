const LOG = require('log4js').getLogger('GetUserBalances.js');
const OrderbookApi = require('./api/OrderbookApi');
const LocalStorage = require('./services/LocalStorage');
const Provider = require('./util/Provider');
const web3 = Provider.web3;


const Application = {
  async init() {
    LOG.info(`Start service initialization`);

    const obContract = await OrderbookApi.orderbook.getContractByVer();

    const contract = web3.eth.contract(obContract.abi).at(obContract.address);
    contract.ver = obContract.ver;

    await LocalStorage.setOBContract({
      address: obContract.address,
      abi: obContract.abi,
      contract,
    });
    LOG.info(`Orderbook contract initiated`);

    const assets = await OrderbookApi.assets.getAssets();
    await LocalStorage.setAssets(assets);
    LOG.info(`Assets initiated`);
  }
};
module.exports = Application;