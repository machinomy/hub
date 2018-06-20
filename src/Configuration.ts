import * as dotenv from 'dotenv'

export interface Configuration {
  port: number
  address: string
  ethereumUrl: string
  databaseUrl: string
  isDevelopment: boolean
}

export namespace Configuration {
  export async function env (options?: dotenv.DotenvOptions): Promise<Configuration> {
    dotenv.load(options)
    const nodeEnv = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
    const isDevelopment = nodeEnv === 'development'

    return {
      port: Number(process.env.PORT),
      address: String(process.env.HUB_ADDRESS),
      ethereumUrl: String(process.env.ETH_RPC_URL),
      databaseUrl: String(process.env.DATABASE_URL),
      isDevelopment: isDevelopment
    }
  }
}

export default Configuration
