# Machinomy Hub [![Build Status](https://travis-ci.com/machinomy/hub.svg?token=K1HKiXykkAKA6zQXxNvq&branch=master)](https://travis-ci.com/machinomy/hub)

Hub provides payments API for [Machinomy](https://github.com/machinomy/machinomy) payment channels.

## API

Payments API TBD

Administration API TBD

## Installation

TBD

## Development

TBD

Create .env file at the root of the project. See [example.env](https://github.com/machinomy/hub/blob/master/example.env) for example.

You need running [Ganache](https://github.com/trufflesuite/ganache) on your local machine if use localhost-related ETHEREUM_API

Also you need to install [PostgreSQL](https://www.postgresql.org/download/) locally as a storage. Hub uses it by default.

**Ensure database and user from .env file exists** in DBMS.

Then install dependencies and build the project:
```
$ yarn
$ yarn build
```
And run the server:
```
$ yarn start
```
Now hub is ready to accept the payments and verify them.


## Settings file (.env file)

Default .env file (example.env):

```
HUB_ADDRESS=0xc8ebc512fd59a9e9b04233a2178e28aa3e42608d
ETH_RPC_URL=http://localhost:8545
PORT=3030
DATABASE_URL=postgresql://paymenthub:1@localhost/PaymentHub
REDIS_HOST=localhost
REDIS_PORT=6379
TABLE_OR_COLLECTION_NAME=hub
```
HUB_ADDRESS - 0x-prefixed Ethereum-address, hub address

ETH_RPC_URL - URL of Ethereum RPC (you can use local Ganache,
but ensure you correctly deployed machinomy-contracts, see instructions below)

PORT - listening port for hub

DATABASE_URL - connection URL for the database. postgresql:// prefix **is mandatory**.


## Working with local Ethereum RPC (via Ganache)

1. Clone Machinomy and Contracts to local filesystem
```
git clone git@github.com:machinomy/machinomy.git
git clone git@github.com:machinomy/contracts.git
```
2. Change directory to contracts and do yarn link, compile and deploy contracts.
```
yarn link
yarn truffle:compile
yarn truffle:migrate --reset
yarn prepublish
```
3. Change directory to machinomy and do yarn link, yarn link @machinomy/contracts
```
yarn link
yarn link @machinomy/contracts
yarn migrate
yarn prepublish
```
4. Change directory to hub and do yarn link machinomy
```
yarn link machinomy
```
5. Rebuild hub
```
yarn build
```
6. Ensure that @machinomy/contracts are available - open this file
```
hub/node_modules/machinomy/node_modules/@machinomy/contracts/dist/build/contracts/Unidirectional.json
```
Search for 'networks' (the only occur will be at very end of file) and check available network IDs.
Network ID from Ganache must be in the list and value of its key 'address' must match address of Unidirectional contract ( address of Unidirectional appears in terminal when you deployed @machinomy/contracts via yarn truffle:migrate --reset)

## Requirements

Node.js 10

yarnpkg 1.6

PostgreSQL 10

Redis
