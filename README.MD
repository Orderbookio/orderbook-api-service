##  To use Orderbook API you have to run this service.

### Pre-conditions
You have to create an account at Orderbook and pass identity verifications.

### --------------------------------------------------------------------
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

**isAuthEnabled**:

*false* - use this option if you are using only one account for this service. There will be no
authentication in this service for your account. If you have more than one account, the
 first one from the config array(users) would be used. **Use this option only locally with closed TCP
ports.**

*true* - Enable basic authentication for the API service. Requires adding authPassword for each user
in properties.json.

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

or execute next command in the project root directory
```
node getAuthPassword.js YOUR_PASSWORD
```

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



### To start server execute
```
npm run prod
```

to see the swagger documentation open http://localhost:5000/documentation

### License
See the [LICENSE](LICENSE) file for details
