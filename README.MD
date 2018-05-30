# Orderbook API Service
###  To use Orderbook API you have to run this service.
### Why?
Orderbook uses client-side cryptography to preserve the highest level of security. And there is no client-side when using API.
Therefore was created special service that would be run locally by an API implementator to preserve the same level of security along with ease of use.


### Pre-conditions
Before using the service make sure you have already registered account at Orderbook.io and passed all required verifications.
This version of API Service does not yet cover operations like registration, verification, deposit and withdrawal.

Please refer to https://help.orderbook.io/ should you have any questions.
Or you can contact our support at support@orderbook.io.


### Before starting server
#### Setup

Install latest LTS Node.js  from
https://nodejs.org/en/download/

To check that you have installed Node.js correctly, open terminal and execute ``` node -v ```.
As a result you should see Node.js latest version, like **8.11.X**, it means everything is okay.

Then go to the project root directory and install dependencies by executing

```
npm install
```

#### Configuration

In the **properties.json** file you have to define the following properties:

* **orderbookUrl** - by default http://localhost:3000, for production: https://api.orderbook.io
* **isAuthEnabled** - true/false.
`false` - Disable authentication. Use this option if you are using only one account for this service. There will be no
authentication for your account. If you have more than one account, the
first one from the config array (*users*) would be used. **Use this option only locally with closed TCP
ports.**
`true` - Enable basic authentication for the API service. Requires adding authPassword for each user
in properties.json. How to generate authPassword would be included below.
* **users** - the array of orderbook users, each user
should have *email*, *OBPassword*, *authPassword* (if isAuthEnabled is true),
`email` is an email you used for registration at Orderbook.
`OBPassword` is your Orderbook password.
.

an example of USERS variable
```javascript
 "users": [
    {
      "email":"test@mail.com",
      "OBPassword":"123456",
      "authPassword":"$2b$10$ktnC1vxrxPUsquk7mLoyJuytOsI1e6MXYi/ned1UUSDNZmD32t0ky"
    },
    {
      "email":"test1@mail.com",
      "OBPassword":"123456",
      "authPassword":"$2b$10$ktnC1vxrxPUsquk7mLoyJuytOsI1e6MXYi/ned1UUSDNZmD32t0ky"
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

or execute next command in the project root directory
```
node getAuthPassword.js YOUR_PASSWORD
```


### Starting server

To start server execute:
```
npm run prod
```

To see swagger documentation open http://localhost:5000/documentation

### License
See the [LICENSE](LICENSE) file for details