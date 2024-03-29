import Configuration from './Configuration'
import { memoize } from 'decko'
import HttpEndpoint from './HttpEndpoint'
import PaymentsController from './controllers/PaymentsController'
import Machinomy from 'machinomy'
import * as Web3 from 'web3'
import Routes from './Routes'
import DashboardController from './controllers/DashboardController'
import AssetsController from './controllers/AssetsController'
import Controllers from './controllers/Controllers'
import GraphqlController from './controllers/GraphqlController'
import GraphiqlController from './controllers/GraphiqlController'
import GraphqlService from './services/GraphqlService'
import AuthController from './controllers/AuthController'
import IAuthService from './services/IAuthService'
import AuthService from './services/AuthService'
import { RedisClient } from 'redis'
import AuthNonceDatabase from './storage/AuthNonceDatabase'
import IAuthentication from './support/IAuthentication'
import Authentication from './support/Authentication'
import Eth from './support/Eth'
import ICorsService from './services/ICorsService'
import CorsService from './services/CorsService'
import HDWalletProvider from '@machinomy/hdwallet-provider'

export default class Registry {
  configuration: Configuration

  private constructor (configuration: Configuration) {
    this.configuration = configuration
  }

  static async build (parameters: Configuration): Promise<Registry> {
    return new Registry(parameters)
  }

  @memoize
  async web3 (): Promise<Web3> {
    let ethereumUrl = this.configuration.ethereumUrl
    let mnemonic = this.configuration.mnemonic
    let provider = new HDWalletProvider(mnemonic, ethereumUrl)
    return new Web3(provider)
  }

  @memoize
  async machinomy (): Promise<Machinomy> {
    let databaseUrl = this.configuration.databaseUrl
    let eth = await this.eth()
    let accounts = await eth.getAccounts()
    let address = accounts[0]
    return new Machinomy(address, eth.web3, { databaseUrl: databaseUrl })
  }

  @memoize
  async redisClient (): Promise<RedisClient> {
    return new RedisClient({
      host: this.configuration.redisHost,
      port: this.configuration.redisPort
    })
  }

  @memoize
  async eth (): Promise<Eth> {
    let web3 = await this.web3()
    return new Eth(web3)
  }

  @memoize
  async authentication (): Promise<IAuthentication> {
    let eth = await this.eth()
    return new Authentication(eth)
  }

  @memoize
  async authService (): Promise<IAuthService> {
    let redisClient = await this.redisClient()
    let database = new AuthNonceDatabase(redisClient)
    let authentication = await this.authentication()
    return new AuthService(database, authentication)
  }

  @memoize
  async graphqlService (): Promise<GraphqlService> {
    let machinomy = await this.machinomy()
    return new GraphqlService(machinomy)
  }

  @memoize
  async controllers (): Promise<Controllers> {
    let machinomy = await this.machinomy()
    let graphqlService = await this.graphqlService()
    let authService = await this.authService()
    return {
      assets: new AssetsController(),
      payments: new PaymentsController(machinomy),
      dashboard: new DashboardController(),
      graphql: new GraphqlController(graphqlService),
      graphiql: new GraphiqlController(),
      auth: new AuthController(authService)
    }
  }

  @memoize
  async routes (): Promise<Routes> {
    let controllers = await this.controllers()
    return new Routes(controllers, this.configuration.isDevelopment)
  }

  @memoize
  async corsService (): Promise<ICorsService> {
    return new CorsService()
  }

  @memoize
  async httpEndpoint (): Promise<HttpEndpoint> {
    let routes = await this.routes()
    let cors = await this.corsService()
    return new HttpEndpoint(this.configuration.port, this.configuration.sessionKeys, routes, cors)
  }
}
