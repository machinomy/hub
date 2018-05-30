import * as dotenv from 'dotenv'

export interface Configuration {
  port: number
  address: string
  ethereumUrl: string
  databaseUrl: string
}

export namespace Configuration {
  export async function env (options?: dotenv.DotenvOptions): Promise<Configuration> {
    dotenv.load(options)
    return {
      port: Number(process.env.PORT),
      address: String(process.env.HUB_ADDRESS),
      ethereumUrl: String(process.env.ETH_RPC_URL),
      databaseUrl: String(process.env.DATABASE_URL)
    }
  }
}

export default Configuration
