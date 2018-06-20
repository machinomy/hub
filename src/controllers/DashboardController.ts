import * as Router from 'koa-router'
import { Middleware } from 'koa'
import * as send from 'koa-send'
import * as path from "path";

export default class DashboardController {
  readonly middleware: Middleware
  readonly allowedMethods: Middleware

  constructor () {
    let router = new Router()
    router.get('/', this.welcome.bind(this))
    this.middleware = router.routes()
    this.allowedMethods = router.allowedMethods()
  }

  async welcome (ctx: Router.IRouterContext) {
    await send(ctx, 'index.html', { root: path.resolve(__dirname, '..', 'public') })
  }
}
