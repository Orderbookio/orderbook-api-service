

# Introduction

## To use Orderbook API you have to run this service. Why?

Orderbook uses client-side cryptography to preserve the highest level of security. And there is no client-side when using API.
Therefore was created special service that would be run locally by an API implementator to preserve the same level of security along with ease of use.

## Pre-conditions

Before using the service make sure you have already registered an account at Orderbook.io and passed all required verifications.
This version of API Service does not yet cover operations like registration, verification, deposit, and withdrawal.

Please refer to [https://help.orderbook.io/](https://help.orderbook.io/) should you have any questions.
Or you can contact our support at support@orderbook.io.

# Setup

Install latest LTS Node.js  from
[https://nodejs.org/en/download/](https://nodejs.org/en/download/)

To check that you have installed Node.js correctly, open terminal and execute ``` node -v ```.
As a result, you should see Node.js latest version, like **8.11.X**, it means everything is okay.

Then go to the project root directory and install dependencies by executing ``` npm install ```

## Configuration

In the **properties.json** file you have to define the following properties:

* **orderbookUrl** - by default [http://localhost:3000](http://localhost:3000), for production: [https://api.orderbook.io](https://api.orderbook.io)
* **isAuthEnabled** - true/false.
`false` - Disable authentication. Use this option if you are using only one account for this service. There will be no
authentication for your account. If you have more than one account, the
first one from the config array (*users*) would be used. **Use this option only locally with closed TCP
ports.**
`true` - Enable basic authentication for the API service. Requires adding authPassword for each user
in properties.json.
* **users** - the array of orderbook users, each user
should have *email*, *OBPassword*, *authPassword* (if isAuthEnabled is true),
`email` is an email you used for registration at Orderbook.
`OBPassword` is your Orderbook password.
`authPassword` any password for basic authentication.

an example of USERS :
```
 "users": [
    {
      "email":"test@mail.com",
      "OBPassword":"123456",
      "authPassword":"11111111"
    },
    {
      "email":"test1@mail.com",
      "OBPassword":"123456",
      "authPassword":"11111111"
    }
  ]
```

## Starting server

To start server execute:
```
npm run prod
```

To see swagger documentation open [http://localhost:5000/documentation](http://localhost:5000/documentation)

# markets
## ***GET***

```shell
curl -X GET --header 'Accept: application/json' 'http://localhost:5000/v1/markets'
```

```javascript
(async function () {
  const response = await axios.get(`${SERVICE_URL}/v1/markets`, {
    auth: {
      username: email,
      password: authPassword
    }
  });
  console.log('markets: ', JSON.stringify(response.data, null, 2));
}());
```

**Summary:** Get available market names

**Description:** Returns an array of market names, for example  ```[
    "OBTC-ETH",
    "OUSD-ETH"
]```

### HTTP Request
***GET*** `/v1/markets`

# balances
## **GET**

```shell
curl -X GET -u email:authPassword --header 'Accept: application/json' 'http://localhost:5000/v1/balances'
```

```javascript
(async function () {
  const response = await axios.get(`${SERVICE_URL}/v1/balances`, {
    auth: {
      username: email,
      password: authPassword
    }
  });
  console.log('balances: ', JSON.stringify(response.data, null, 2));
}());
```

**Summary:** Get user balances

**Description:** Get user balance by all the assets

### HTTP Request
***GET*** `/v1/balances`

# orderbook/{market}
## ***GET***

```shell
curl -X GET --header 'Accept: application/json' 'http://localhost:5000/v1/orderbook/{market}'
```

```javascript
(async function () {
  const response = await axios.get(`${SERVICE_URL}/v1/orderbook/OBTC-ETH`, {
    auth: {
      username: email,
      password: authPassword
    }
  });
  console.log('open orders: ', JSON.stringify(response.data, null, 2));
}());
```

**Summary:** Get open orders by market name

**Description:** Returns buy and sell orders for specified market, example ```{
    "buy": [],
    "sell": [
        {
            "price": "0.5",
            "amount": "3",
        }
    ]
}```

### HTTP Request
***GET*** `/v1/orderbook/{market}`

# orders/{market}
## ***GET***

```shell
curl -X GET -u email:authPassword --header 'Accept: application/json' 'http://localhost:5000/v1/orders/{market}'
```

```javascript
(async function () {
  const response = await axios.get(`${SERVICE_URL}/v1/orders/OBTC-ETH`, {
    auth: {
      username: email,
      password: authPassword
    }
  });
  console.log('user orders: ', JSON.stringify(response.data, null, 2));
}());
```

**Summary:** Get user open orders by market name

**Description:** Returns user buy and sell orders for specified market, example ```{
    "buy": [],
    "sell": [
        {
            "id": "10",
            "price": "0.5",
            "amount": "3",
            "openAmount": "3"
        }
    ]
}```

### HTTP Request
***GET*** `/v1/orders/{market}`

# orders
## ***POST***

```shell
curl -X POST -u email:authPassword --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"type":"sell", "amount":"1", "price":"100", "market":"OBTC-ETH"}' 'http://localhost:5000/v1/orders'
```

```javascript
(async function () {
  const response = await axios.post(`${SERVICE_URL}/v1/orders`, {
    type: 'sell',
    amount: '1',
    price: '30',
    market: 'OBTC-ETH'
  }, {
    auth: {
      username: email,
      password: authPassword
    }
  });
  console.log('order created: ', JSON.stringify(response.data, null, 2));
}());
```

**Summary:** Create order

**Description:** Returns hash of created order

### HTTP Request
***POST*** `/v1/orders`

**Parameters**

| Name | Located in | Description | Required | Type |
| ---- | ---------- | ----------- | -------- | ---- |
| type | body | 'buy' or 'sell' | Yes | String |
| amount | body |  | Yes | String |
| price | body |  | Yes | String |
| market | body | market name | Yes | String |


## ***DELETE***

```shell
curl -X DELETE -u email:authPassword --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"orderId":"1", "market":"OBTC-ETH"}' 'http://localhost:5000/v1/orders'
```

```javascript
(async function () {
  const response = await axios.delete(`${SERVICE_URL}/v1/orders`, {
    orderId: '2',
    market: 'OBTC-ETH'
  }, {
    auth: {
       username: email,
       password: authPassword
    }
  });
  console.log('order deleted: ', JSON.stringify(response.data, null, 2));
}());
```

**Summary:** Delete user order by orderId where orderId you can get from user open orders endpoint: '/orders/${market}'

**Description:** Returns hash of deleted order

### HTTP Request
***DELETE*** `/v1/orders`

**Parameters**

| Name | Located in | Description | Required | Type |
| ---- | ---------- | ----------- | -------- | ---- |
| orderId | body | 'orderId' you can get from '/orders/{market}' | Yes | String |
| market | body | market name | Yes | String |


# trades/{market}
## ***GET***

```shell
curl -X GET --header 'Accept: application/json' 'http://localhost:5000/v1/trades/{market}'
```

```javascript
(async function () {
  const response = await axios.get(`${SERVICE_URL}/v1/trades/OBTC-ETH`, {
    auth: {
      username: email,
      password: authPassword
    }
  });
  console.log('trading history: ', JSON.stringify(response.data, null, 2));
}());
```

**Summary:** Get trades by market name

**Description:** Returns trades array by market name

### HTTP Request
***GET*** `/v1/trades/{market}`

# transaction/{hash}/status
## ***GET***

```shell
curl -X GET --header 'Accept: application/json' 'http://localhost:5000/v1/transaction/{hash}/status'
```

```javascript
(async function () {
  const response = await axios.get(`${SERVICE_URL}/v1/transaction/0xf002f7736144e3c9d2c26389dbb98dc1ed7fdbcede476989c9ce7710fee7cf370xf002f7736144e3c9d2c26389dbb98dc1ed7fdbcede476989c9ce7710fee7cf37/status`);
  console.log('transaction status: ', JSON.stringify(response.data, null, 2));
}());
```

**Summary:** Get transaction status by hash

**Description:** Returns object with the status and timestamp. The timestamp is transaction creation date

### HTTP Request
***GET*** `/v1/transaction/{hash}/status`

# License

See the [LICENSE](LICENSE) file for details
