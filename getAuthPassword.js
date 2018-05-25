const Bcrypt = require('bcrypt');

const args = process.argv.slice(2);

(async function () {
  const salt = await Bcrypt.genSalt();
  const password = args[0];
  const hashed = await Bcrypt.hash(password, salt);
  console.log(`hashed password: ${hashed}`);
}());