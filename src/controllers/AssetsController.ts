import * as Router from 'koa-router'
import { Middleware } from 'koa'
import * as send from 'koa-send'
import * as path from 'path'

export default class AssetsController {
  readonly middleware: Middleware

  constructor () {
    let router = new Router()
    router.get('*', this.serve.bind(this))
    this.middleware = router.routes()
  }

  async serve (ctx: Router.IRouterContext) {
    await send(ctx, ctx.path, { root: path.resolve(__dirname, '..', 'public') })
  }
}
