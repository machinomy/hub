import * as dotenv from 'dotenv'

export interface Configuration {
  port: number
  ethereumUrl: string
  databaseUrl: string
  redisUrl: string
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
      isDevelopment: isDevelopment(),
      sessionKeys: sessionKeys(),
      mnemonic: process.env.MNEMONIC as string
    }
  }
}

export default Configuration
