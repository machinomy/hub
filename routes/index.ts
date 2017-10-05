import * as express from 'express';
export let router = express.Router();

import {Hub} from 'machinomy/lib/hub'
import Storage from 'machinomy/lib/storage'
import Web3 = require('web3')
import machinomy from 'machinomy/lib/buy'
import mongo from 'machinomy/lib/mongo'
import { ChannelContract, PaymentChannel } from 'machinomy/lib/channel'
import { digest, sign } from "machinomy/lib/Payment";
let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
let settings = machinomy.configuration.receiver()
web3.personal.unlockAccount(settings.account, settings.password, 1000)
let storage = new Storage(web3, settings.databaseFile, "receiver", false, settings.engine);
const hub = new Hub(web3, settings.account, storage);


// let claim = (storage: Storage, contract: ChannelContract, paymentChannel: PaymentChannel) => {
//   let channelId = paymentChannel.channelId;
//   storage.payments
//   .firstMaximum(channelId)
//   .then((paymentDoc: any) => {
//     let paymentDigest = digest(paymentChannel.channelId, paymentDoc.value);
//     sign(web3, paymentChannel.receiver, paymentDigest).then(signature => {
//       let r = "0x" + signature.r.toString("hex");
//       let s = "0x" + signature.s.toString("hex");
//       console.log(channelId)
//       console.log(paymentDoc.value)
//       console.log(Number(signature.v))
//       console.log(r)
//       console.log(s)
      
//       let canClaim = contract.canClaim(channelId, paymentDoc.value, Number(signature.v), r, s);
//       canClaim.then((value)=>{
//         console.log('value')
//         console.log(value)
//       })
  
//       console.log(canClaim)
//       // if (canClaim) {
//         contract
//           .claim(paymentChannel.receiver, paymentChannel.channelId, paymentDoc.value, Number(signature.v), r, s)
//           .then(value => {
//             console.log("Claimed " + value + " out of " + paymentChannel.value + " from channel " + channelId);
//           })
//           .catch(error => {
//             throw error;
//           });
//       // } else {
//       //   console.log("Can not claim " + paymentDoc.value + " from channel " + channelId);
//       // }
//     });
//   })
//   .catch((error: any) => {
//     throw error;
//   });
// }

console.log(settings.engine)
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

// router.get('/claim', (req: express.Request, res: express.Response, next: express.NextFunction):any => {
//   console.log('1');
//   let channelId = '0x8266c9cfd8dabe6f78455c38dd0de8582c4fa8f7b2e2a0cae9fbe2a3861fc0c6'
//   let s = new Storage(web3, settings.databaseFile, 'receiver', true, settings.engine);
//   let contract = machinomy.contract(web3)
  
//   s.channels.firstById(channelId).then(paymentChannel => {
//     if (paymentChannel) {
//       contract.getState(channelId).then(state => {
//         claim(s, contract, paymentChannel)
//       })
//     } 
//   }).catch(error => {
//     throw error
//   })
  
// });



