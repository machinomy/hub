import Configuration from './Configuration'
import { memoize } from 'decko'
import Endpoint from './Endpoint'
import PaymentsController from './controllers/PaymentsController'
import Machinomy from 'machinomy'
import * as Web3 from 'web3'
import Routes from "./Routes";
import DashboardController from "./controllers/DashboardController";

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
  async paymentsController (): Promise<PaymentsController> {
    let machinomy = await this.machinomy()
    return new PaymentsController(machinomy)
  }

  @memoize
  async dashboardController (): Promise<DashboardController> {
    return new DashboardController()
  }

  @memoize
  async routes (): Promise<Routes> {
    let payments = await this.paymentsController()
    let dashboard = await this.dashboardController()
    return new Routes(dashboard, payments)
  }

  @memoize
  async endpoint (): Promise<Endpoint> {
    let routes = await this.routes()
    return new Endpoint(this.configuration.port, routes)
  }
}
