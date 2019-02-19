const config = require('./config/index');

const LOG = require('log4js').getLogger('Application.js');
const OrderbookApi = require('./api/OrderbookApi');
const LocalStorage = require('./services/LocalStorage');
const Provider = require('./util/Provider');
const web3 = Provider.web3;


const Application = {
  async init() {
    LOG.info(`OB url: ${config.orderbookUrl}`);
    LOG.info(`Loading OB contract...`);

    const obContract = await OrderbookApi.orderbook.getContractByVer();
    const contract = web3.eth.contract(obContract.abi).at(obContract.address);
    contract.ver = obContract.ver;

    await LocalStorage.setOBContract({
      address: obContract.address,
      abi: obContract.abi,
      contract,
    });

    LOG.info(`Loaded OB contract. Version: ${contract.ver}, address: ${obContract.address}`);
    LOG.info(`Loading assets...`);

    const assets = await OrderbookApi.assets.getAssets();
    await LocalStorage.setAssets(assets);

    LOG.info(`Loaded assets: ${Object.keys(assets)}`);
  }
};
module.exports = Application;
