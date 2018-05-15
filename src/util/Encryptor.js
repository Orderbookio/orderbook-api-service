const LOG = require('log4js').getLogger('Encryptor.js');

const Ambisafe = require('ambisafe-client-javascript');


const Encryptor = {
  decrypt(encryptedContainer, password) {
    if (!password) {
      LOG.warn(`Warning! Decryption with empty password.`);
    }

    const account = new Ambisafe.Account(encryptedContainer, password);
    return account.data.private_key;
  }
};


module.exports = Encryptor;
