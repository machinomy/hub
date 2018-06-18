import * as Router from 'koa-router'
import { Middleware } from 'koa'
import IEndpointContext from '../IEndpointContext'

export default class DashboardController {
  middleware: Middleware

  constructor () {
    let router = new Router()
    router.get('/', this.welcome.bind(this))
    this.middleware = router.routes()
  }

  async welcome (ctx: IEndpointContext) {
    ctx.response.body = 'Welcome to Hub Dashboard'
  }
}
