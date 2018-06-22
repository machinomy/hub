import * as Router from 'koa-router'
import Machinomy from 'machinomy'
import Logger from '../support/Logger'
import { Middleware } from 'koa'

const log = new Logger('hub:payments-router')

export default class PaymentsController {
  middleware: Middleware
  allowedMethods: Middleware
  machinomy: Machinomy

  constructor (machinomy: Machinomy) {
    this.machinomy = machinomy

    let router = new Router()
    router.head('/accept', this.heartbeat.bind(this))
    router.post('/accept', this.accept.bind(this))
    router.get('/verify/:token', this.verify.bind(this))

    this.middleware = router.routes()
    this.allowedMethods = router.allowedMethods()
  }

  async heartbeat (ctx: Router.IRouterContext) {
    ctx.response.set('Access-Control-Allow-Origin', ctx.request.origin)
    ctx.response.body = null
  }

  async accept (ctx: Router.IRouterContext) {
    let body = ctx.request.body
    log.debug('body: %o', body)
    let { token } = await this.machinomy.acceptPayment(body)
    ctx.status = 202
    ctx.set('Paywall-Token', token)
    ctx.response.body = { token }
    log.debug('respond with token %s', token)
  }

  async verify (ctx: Router.IRouterContext) {
    log.debug('params: %o', ctx.params)
    const token = String(ctx.params.token)
    const acceptToken = await this.machinomy.acceptToken({ token })
    const isAccepted = acceptToken.status
    if (isAccepted) {
      log.debug('token accepted')
      ctx.status = 200
    } else {
      log.debug('token not accepted')
      ctx.status = 400
    }
  }
}
