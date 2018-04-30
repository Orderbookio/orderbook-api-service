const ethUtil = require('ethereumjs-util');
const Provider = require('./Provider');
const web3 = Provider.web3;

const { ecsign, addHexPrefix, stripHexPrefix, toBuffer: toBuff } = ethUtil;


function _ecsign(hash, privateKey) {
  return ecsign(toBuffer(hash), toBuffer(privateKey));
}

function toBuffer(input) {
  return toBuff(addHexPrefix(input));
}

function sign(hash, privateKey) {
  if (privateKey === undefined) {
    throw Error('Signing hashes is only possible after setPrivateKey().');
  }
  const signature = _ecsign(hash, toBuffer(privateKey));
  return {
    v: signature.v,
    r: `0x${signature.r.toString('hex')}`,
    s: `0x${signature.s.toString('hex')}`,
  };
}

function prepareOperation(destination, weiValue, data, userContract, nonce, privateKey) {
  const formattedNonce = ethUtil.setLengthLeft(web3.toHex(nonce), 32).toString('hex');
  const formattedValue = ethUtil.setLengthLeft(web3.toHex(weiValue), 32).toString('hex');

  // format: 0x + destination + ethValue + data + ambiUserAddress + nonce
  const op = web3.sha3(
    `0x${
      stripHexPrefix(destination)
      }${formattedValue
      }${stripHexPrefix(data)
      }${stripHexPrefix(userContract)
      }${formattedNonce}`,
    { encoding: 'hex' }
  );

  const sig = privateKey ? sign(op, privateKey) : null;

  return { op, sig };
}

module.exports = {
  sign,
  prepareOperation
};