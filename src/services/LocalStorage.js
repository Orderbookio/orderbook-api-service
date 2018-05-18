class LocalStorage {
  constructor() {
    this.items = {
      AUTH_DATA: 'AUTH_DATA',
      CONTAINERS: 'CONTAINERS',
      CONTRACT: 'CONTRACT',
      ASSETS: 'ASSETS',
      APPROVE_TXS: 'APPROVE_TXS',
      AUTO_DEPOSIT_REQUIRED: 'AUTO_DEPOSIT_REQUIRED',
    };

    this.storage = {};
  }

  getAuthData(email) {
    const data = this.storage[this.items.AUTH_DATA];
    if (!data) {
      return {};
    }
    return data[email] || {};
  }

  setAuthData(email, authData) {
    const data = this.storage[this.items.AUTH_DATA] || {};
    data[email] = authData;
    this.storage[this.items.AUTH_DATA] = data;
  }

  getContainers() {
    return this.storage[this.items.CONTAINERS] || {};
  }

  setContainers(containers) {
    this.storage[this.items.CONTAINERS] = containers;
  }

  getOBContract() {
    return this.storage[this.items.CONTRACT] || {};
  }

  setOBContract(contract) {
    this.storage[this.items.CONTRACT] = contract;
  }


  getAssets() {
    return this.storage[this.items.ASSETS] || {};
  }

  setAssets(assets) {
    this.storage[this.items.ASSETS] = assets;
  }

  getApproveTxs(email) {
    const data = this.storage[this.items.APPROVE_TXS];
    if (!data) {
      return [];
    }
    return data[email] || [];
  }

  setApproveTxs(email, txs) {
    const data = this.storage[this.items.APPROVE_TXS] || {};
    data[email] = txs;
    this.storage[this.items.APPROVE_TXS] = data;
  }

  isAutoDepositRequired(email) {
    const data = this.storage[this.items.AUTO_DEPOSIT_REQUIRED] || {};
    return data[email] || true;
  }

  setAutoDepositRequired(email, isRequired) {
    const data = this.storage[this.items.AUTO_DEPOSIT_REQUIRED] || {};
    data[email] = isRequired;
    this.storage[this.items.AUTO_DEPOSIT_REQUIRED] = data;
  }
}


module.exports = new LocalStorage();
