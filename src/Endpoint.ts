import * as Koa from 'koa'
import * as http from 'http'
import Logger from './support/Logger'
import * as bodyParser from 'koa-bodyparser'
import Routes from './Routes'

const log = new Logger('hub:endpoint')

export default class Endpoint {
  app: Koa
  private readonly port: number
  private server?: http.Server

  constructor (port: number, routes: Routes) {
    this.app = new Koa()
    this.app.use(bodyParser())
    this.app.use(routes.middleware)
    this.port = port
  }

  async listen (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let server = this.app.listen(this.port, () => {
        this.server = server
        log.info('listen on port %d', this.port)
        resolve()
      })
      this.app.onerror = error => {
        reject(error)
      }
    })
  }

  async close (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.server) {
        this.server.close((error: any) => {
          if (error) {
            reject(error)
          } else {
            this.server = undefined
            resolve()
          }
        })
      } else {
        reject(new Error('Endpoint is not running'))
      }
    })
  }
}
