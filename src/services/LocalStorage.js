const localStorage = require('localStorage');

class LocalStorage {
  constructor() {
    this.items = {
      AUTH_DATA: 'AUTH_DATA',
      CONTAINERS: 'CONTAINERS',
      CONTRACT: 'CONTRACT',
      ASSETS: 'ASSETS',
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
    // const containers = localStorage.getItem(this.items.CONTAINERS);
    // return containers ? JSON.parse(containers) : {};
    return this.storage[this.items.CONTAINERS] || {};
  }

  setContainers(containers) {
    // localStorage.setItem(this.items.CONTAINERS, JSON.stringify(containers));
    this.storage[this.items.CONTAINERS] = containers;
  }

  setOBContract(contract) {
    // localStorage.setItem(this.items.CONTRACT, JSON.stringify(contract));
    this.storage[this.items.CONTRACT] = contract;
  }

  getOBContract() {
    // const contract = localStorage.getItem(this.items.CONTRACT);
    // return contract ? JSON.parse(contract) : {};
    return this.storage[this.items.CONTRACT] || {};
  }

  setAssets(assets) {
    this.storage[this.items.ASSETS] = assets;
  }

  getAssets() {
    return this.storage[this.items.ASSETS] || {};
  }
}

module.exports = new LocalStorage();