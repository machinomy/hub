import * as Koa from 'koa'
import * as http from 'http'
import Logger from '@machinomy/logger'
import * as bodyParser from 'koa-bodyparser'
import * as session from 'koa-session'
import Routes from './Routes'
import ICorsService from './services/ICorsService'

const log = new Logger('hub:http-endpoint')

export default class HttpEndpoint {
  app: Koa
  private readonly port: number
  private server?: http.Server

  constructor (port: number, keys: Array<string>, routes: Routes, cors: ICorsService) {
    this.app = new Koa()
    this.app.keys = keys
    this.app.use(cors.middleware)
    this.app.use(session({
      maxAge: 86400000
    }, this.app))
    this.app.use(bodyParser())
    this.app.use(routes.middleware)
    this.app.use(routes.allowedMethods)
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
        reject(new Error('HttpEndpoint is not running'))
      }
    })
  }
}
