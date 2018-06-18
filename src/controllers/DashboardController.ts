import * as Router from 'koa-router'
import { Middleware } from 'koa'
import * as send from 'koa-send'
import * as path from "path";

export default class DashboardController {
  readonly middleware: Middleware

  constructor () {
    let router = new Router()
    router.get('/', this.welcome.bind(this))
    this.middleware = router.routes()
  }

  async welcome (ctx: Router.IRouterContext) {
    await send(ctx, 'index.html', { root: path.resolve(__dirname, '..', 'public') })
  }
}
