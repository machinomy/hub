#!/usr/bin/env node

import { Hub, Configuration } from '../index'

async function main () {
  let configuration = await Configuration.env()
  let hub = await Hub.build(configuration)
  return hub.start()
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
