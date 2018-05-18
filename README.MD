##  To use Orderbook API you have to run this service.

Before starting server:
### Setup
Install node **8.9.1** and npm **5.5.11**

then install dependencies

```
npm install
```
### Configuration

**We have to define env variables:**

**ORDERBOOK_URL** - by default http://localhost:3000, for production: https://api.orderbook.io
**IS_AUTH_ENABLED** - true/false. This option enable or not BASIC authentication
for all the endpoints which requires orderbook JWT authentication.
If auth disabled, service will get first user in array for orderbook authentication.

**USERS** - the array of orderbook users, each user
should have *email*, *OBPassword*, *authPassword*, *proxyAddress*, *userContractAddress*

an example of USERS variable
```javascript
[{"email":"test@mail.com","OBPassword":"123456","authPassword":"$2b$10$ktnC1vxrxPUsquk7mLoyJuytOsI1e6MXYi/ned1UUSDNZmD32t0ky", "proxyAddress": "0xda62d634232878acf489882ddda780986f2361af", "userContractAddress": "0x8708a00e249c108fcf0c01a8a98307d3537aa44f"},
 {"email":"test1@mail.com","OBPassword":"123456","authPassword":"$2b$10$ktnC1vxrxPUsquk7mLoyJuytOsI1e6MXYi/ned1UUSDNZmD32t0ky", "proxyAddress": "0x26edee9f9cbca98e0b08c76ec637623d983b0be9", "userContractAddress": "0xfbe0ce52f1a8e25c6dc6320c70021ef08460bdc2"}]
```

To generate **authPassword** you can use Bycrypt
and example
```javascript
(async function () {
  const salt = await Bcrypt.genSalt();
  const password = '123456';
  const hashed = await Bcrypt.hash(password, salt);
  console.log(`hashed password: ${hashed}`);
}());
```

**To start server execute**
```
npm run prod
```