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
    let provider = new Web3.providers.HttpProvider(ethereumUrl)
    return new Web3(provider)
  }

  @memoize
  async machinomy (): Promise<Machinomy> {
    let address = this.configuration.address
    let databaseUrl = this.configuration.databaseUrl
    let web3 = await this.web3()
    return new Machinomy(address, web3, { databaseUrl: databaseUrl })
  }

  @memoize
  async graphqlService (): Promise<GraphqlService> {
    return new GraphqlService()
  }

  @memoize
  async controllers (): Promise<Controllers> {
    let machinomy = await this.machinomy()
    let graphqlService = await this.graphqlService()
    return {
      assets: new AssetsController(),
      payments: new PaymentsController(machinomy),
      dashboard: new DashboardController(),
      graphql: new GraphqlController(graphqlService),
      graphiql: new GraphiqlController()
    }
  }

  @memoize
  async routes (): Promise<Routes> {
    let controllers = await this.controllers()
    return new Routes(controllers, this.configuration.isDevelopment)
  }

  @memoize
  async httpEndpoint (): Promise<HttpEndpoint> {
    let routes = await this.routes()
    return new HttpEndpoint(this.configuration.port, routes)
  }
}
