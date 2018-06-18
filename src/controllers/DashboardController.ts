import * as Router from 'koa-router'
import { Middleware } from 'koa'
import IEndpointContext from '../IEndpointContext'

export default class DashboardController {
  middleware: Middleware

  constructor () {
    let router = new Router()
    router.head('/', this.heartbeat.bind(this))
    this.middleware = router.routes()
  }

  async heartbeat (ctx: IEndpointContext) {
    ctx.response.body = 'ROOT'
  }
}
