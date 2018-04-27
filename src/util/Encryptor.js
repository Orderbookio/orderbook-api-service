const Ambisafe = require('ambisafe-client-javascript');

const Encryptor = {
  encrypt(privateKey, password) {
    if (!password) {
      console.log('Warning! Encryption with empty password.');
    }

    const account = Ambisafe.fromPrivateKey(privateKey, password);
    return account.getContainer();
  },

  decrypt(encryptedContainer, password) {
    if (!password) {
      console.log('Warning! Decryption with empty password.');
    }

    const account = new Ambisafe.Account(encryptedContainer, password);
    return account.data.private_key;
  }
};

module.exports = Encryptor;