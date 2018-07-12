#!/usr/bin/env node

import { Hub, Configuration } from '../index'

async function main () {
  let configuration = await Configuration.env()
  const ethNodeAvailable = await Configuration.checkEthereumNodeAvailability(configuration.ethereumUrl)
  if (ethNodeAvailable !== true) {
    throw Error(`Ethereum node "${configuration.ethereumUrl}" is not available!`)
  }
  const databaseAvailable = await Configuration.checkDatabaseAvailability(configuration.databaseUrl)
  if (databaseAvailable !== true) {
    throw Error(`Database is not available via URL "${configuration.databaseUrl}"!`)
  }
  let hub = await Hub.build(configuration)
  return hub.start()
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
