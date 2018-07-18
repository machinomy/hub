#!/usr/bin/env node

import { Hub, Configuration } from '../index'

async function main () {
  let configuration = await Configuration.env()
  let hub = await Hub.build(configuration)
  return hub.start()
}

main().then(() => {
  console.info('*** HUB IS RUNNING ***')
}).catch((error: Error) => {
  console.error(error)
  console.info('*** HUB WAS TERMINATED ***')
  process.exit(1)
})
