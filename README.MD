##  To use Orderbook API you have to run this service.

Before starting server:
### Setup

Install latest LTS nodejs  from
https://nodejs.org/en/download/

Open terminal and check that you installed nodejs correctly
execude ``` node -v ``` command

as a result you will see **8.11.X**, it means everything is okay

then go to the project root directory and install dependencies

```
npm install
```

### Configuration

In the **properties.json** file you have to define next config

**orderbookUrl** - by default http://localhost:3000, for production: https://api.orderbook.io

**isAuthEnabled** - true/false. This option enable or not BASIC authentication
for all the endpoints which requires orderbook JWT authentication.
If auth disabled, service will get first user in array for orderbook authentication.

**users** - the array of orderbook users, each user
should have *email*, *OBPassword*, *authPassword* (if isAuthEnabled is true), *proxyAddress*, *userContractAddress*

an example of USERS variable
```javascript
 "users": [
    {
      "email":"test@mail.com",
      "OBPassword":"123456",
      "authPassword":"$2b$10$ktnC1vxrxPUsquk7mLoyJuytOsI1e6MXYi/ned1UUSDNZmD32t0ky",
      "proxyAddress":"0xda62d634232878acf489882ddda780986f2361af",
      "userContractAddress":"0x8708a00e249c108fcf0c01a8a98307d3537aa44f"
    },
    {
      "email":"test1@mail.com",
      "OBPassword":"123456",
      "authPassword":"$2b$10$ktnC1vxrxPUsquk7mLoyJuytOsI1e6MXYi/ned1UUSDNZmD32t0ky",
      "proxyAddress":"0x26edee9f9cbca98e0b08c76ec637623d983b0be9",
      "userContractAddress":"0xfbe0ce52f1a8e25c6dc6320c70021ef08460bdc2"
    }
  ]
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

or execute in the project root directory
```
node getAuthPassword.js YOU_PASSWORD
```

### To start server execute
```
npm run prod
```

to see swagger documentation open http://localhost:5000/documentation

### License
See the [LICENSE](LICENSE) file for details
