class LocalStorage {
  constructor() {
    this.items = {
      AUTH_DATA: 'AUTH_DATA',
      CONTAINERS: 'CONTAINERS',
      CONTRACT: 'CONTRACT',
      ASSETS: 'ASSETS',
      APPROVE_TXS: 'APPROVE_TXS'
    };

    this.storage = {};
  }

  getAuthData(email) {
    const data = this.storage[this.items.AUTH_DATA];
    if (!data) {
      return {};
    }
    const dataByEmail = data[email];
    if (!dataByEmail) {
      return {};
    }
    return dataByEmail;
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

  setOBContract(contract) {
    this.storage[this.items.CONTRACT] = contract;
  }

  getOBContract() {
    return this.storage[this.items.CONTRACT] || {};
  }

  setAssets(assets) {
    this.storage[this.items.ASSETS] = assets;
  }

  getAssets() {
    return this.storage[this.items.ASSETS] || {};
  }

  getApproveTxs(email) {
    const data = this.storage[this.items.APPROVE_TXS];
    if (!data) {
      return {};
    }
    const dataByEmail = data[email];
    if (!dataByEmail) {
      return {};
    }
    return dataByEmail;
  }

  setApproveTxs(email, txs) {
    const data = this.storage[this.items.APPROVE_TXS] || {};
    data[email] = txs;
    this.storage[this.items.APPROVE_TXS] = data;
  }
}

module.exports = new LocalStorage();