import * as dotenv from 'dotenv'
import fetcher from 'machinomy/lib/util/fetcher'
import * as pg from 'pg'

export interface Configuration {
  port: number
  ethereumUrl: string
  databaseUrl: string
  redisUrl: string,
  redisHost: string,
  redisPort: number,
  isDevelopment: boolean
  sessionKeys: Array<string>
  mnemonic: string
}

export namespace Configuration {
  function isDevelopment (): boolean {
    const nodeEnv = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
    return nodeEnv === 'development'
  }

  function sessionKeys (): Array<string> {
    const raw = process.env.SESSION_KEYS || 'machinomy-hub-7ed7d1e415137f51272715234b9d7583'
    return raw.split(',')
  }

  export async function env (options?: dotenv.DotenvOptions): Promise<Configuration> {
    dotenv.load(options)

    return {
      port: Number(process.env.PORT),
      ethereumUrl: process.env.ETH_RPC_URL || 'http://localhost:8545',
      databaseUrl: process.env.DATABASE_URL || 'postgres://localhost@hub',
      redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
      redisHost: process.env.REDIS_HOST || 'localhost',
      redisPort: Number(process.env.REDIS_PORT) || 6379,
      isDevelopment: isDevelopment(),
      sessionKeys: sessionKeys(),
      mnemonic: process.env.MNEMONIC as string
    }
  }

  export function checkEthereumNodeAvailability (url: string): Promise<boolean> {
    return fetcher.fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        'jsonrpc': '2.0',
        'method': 'net_version'
      })
    }).then(response => response.ok).catch(() => false)
  }

  export function checkDatabaseAvailability (url: string): Promise<boolean> {
    const client = new pg.Client({ connectionString: url })

    return client.connect().then(() => true).catch(() => false)
  }
}

export default Configuration
