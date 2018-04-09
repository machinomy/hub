# Machinomy hub [![Build Status](https://travis-ci.com/machinomy/hub.svg?token=K1HKiXykkAKA6zQXxNvq&branch=master)](https://travis-ci.com/machinomy/hub)
Hub provide [Machinomy](https://github.com/machinomy/machinomy) compatible API for payment acceptance and verification.

## API
Follow [documentation](https://machinomy.com/documentation/hub-api/index.html) for more information.

## Development
Create .env file at the root of the project and set RECEIVER, RECEIVER_PASSWORD, ETHEREUM_API and PORT variables. See [example.env](https://github.com/machinomy/hub/blob/master/example.env) for example.

You need running [geth](https://github.com/ethereum/go-ethereum/wiki/geth) on your local machine if use ETHEREUM_API=http://localhost:8545

Also you need to install [mongodb](https://docs.mongodb.com/manual/installation/) locally as a storage. Hub uses it by default.

Then build the project: 
```
$ yarn build
```
And run the server:
```
$ node bin/www.js
```
Now hub is ready to accept the payments.
