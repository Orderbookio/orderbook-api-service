const localStorage = require('localStorage');

class LocalStorage {
  constructor() {
    this.items = {
      JWT_TOKENS: 'JWT_TOKENS',
      CONTAINERS: 'CONTAINERS'
    };
  }

  getTokens() {
    const tokens = localStorage.getItem(this.items.JWT_TOKENS);
    return tokens ? JSON.parse(tokens) : {};
  }

  setTokens(tokens) {
    localStorage.setItem(this.items.JWT_TOKENS, JSON.stringify(tokens));
  }

  getContainers() {
    const containers = localStorage.getItem(this.items.CONTAINERS);
    return containers ? JSON.parse(containers) : {};
  }

  setContainers(containers) {
    localStorage.setItem(this.items.CONTAINERS, JSON.stringify(containers));
  }
}

module.exports = new LocalStorage();