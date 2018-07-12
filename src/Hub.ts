import Configuration from './Configuration'
import Registry from './Registry'
import Logger from './support/Logger'

const log = new Logger('hub')

export default class Hub {
  registry: Registry

  constructor (registry: Registry) {
    this.registry = registry
  }

  static async build (configuration: Configuration): Promise<Hub> {
    let registry = await Registry.build(configuration)
    return new Hub(registry)
  }

  async start (): Promise<void> {
    const eth = await this.registry.eth()
    if ((await eth.isConnected()) !== true) {
      throw Error(`Ethereum node "${this.registry.configuration.ethereumUrl}" is not available!`)
    }
    let endpoint = await this.registry.httpEndpoint()
    let running = endpoint.listen()
    log.info('start hub')
    return running
  }
}
