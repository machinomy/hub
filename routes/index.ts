import * as express from 'express';
export let router = express.Router();

import {Hub} from 'machinomy/lib/hub'
import Web3 = require('web3')
import machinomy from 'machinomy/index'
let settings = machinomy.configuration.receiver()
let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
web3.personal.unlockAccount(settings.account, settings.password, 1000)
const hub = new Hub(web3, settings.account, null)

router.post('/machinomy', hub.payment())

router.get('/verify', hub.verify())

router.get('/isalive', (req: express.Request, res: express.Response, next: express.NextFunction):any => {
  res.send('yes')
});
