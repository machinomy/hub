import * as Router from 'koa-router'
import Machinomy from 'machinomy'
import IEndpointContext from '../IEndpointContext'
import Logger from '../support/Logger'
import { Middleware } from 'koa'

const log = new Logger('hub:payments-router')

export default class PaymentsController {
  routes: Middleware
  machinomy: Machinomy

  constructor (machinomy: Machinomy) {
    this.machinomy = machinomy

    let router = new Router()
    router.head('/accept', this.heartbeat.bind(this))
    router.post('/accept', this.accept.bind(this))
    router.get('/verify/:token', this.verify.bind(this))

    this.routes = router.routes()
  }

  async heartbeat (ctx: IEndpointContext) {
    ctx.response.set('Access-Control-Allow-Origin', ctx.request.origin)
    ctx.response.body = null
  }

  async accept (ctx: IEndpointContext) {
    let body = ctx.request.body
    log.debug('body: %o', body)
    let { token } = await this.machinomy.acceptPayment(body)
    ctx.status = 202
    ctx.set('Paywall-Token', token)
    ctx.response.body = { token }
    log.debug('respond with token %s', token)
  }

  async verify (ctx: IEndpointContext) {
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
