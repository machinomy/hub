import * as express from 'express';
export let router = express.Router();

import {Hub} from 'machinomy/lib/hub'
import Storage from 'machinomy/lib/storage'
import Web3 = require('web3')
import machinomy from 'machinomy/index'
import mongo from 'machinomy/lib/mongo'
let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
let settings = machinomy.configuration.receiver()
web3.personal.unlockAccount(settings.account, settings.password, 1000)
let storage = new Storage(web3, settings.databaseFile, "receiver", true, settings.engine);
const hub = new Hub(web3, settings.account, storage);

if (settings.engine == "mongo") {
  mongo.connectToServer(() => {
    router.post('/machinomy', hub.payment())
    router.get('/verify', hub.verify())
  });
} else {
  router.post("/machinomy", hub.payment());
  router.get("/verify", hub.verify());
}

router.get('/isalive', (req: express.Request, res: express.Response, next: express.NextFunction):any => {
  res.send('yes')
});
