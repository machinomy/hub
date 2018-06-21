import * as Router from 'koa-router'
import { Middleware } from 'koa'
import IAuthService from '../services/IAuthService'
import Logger from '../support/Logger'

const log = new Logger('controller:auth')

export default class AuthController {
  readonly middleware: Middleware
  readonly allowedMethods: Middleware
  readonly authService: IAuthService

  constructor (authService: IAuthService) {
    this.authService = authService

    let router = new Router()
    router.get('/challenge', this.getChallenge.bind(this))
    router.post('/challenge', this.postChallenge.bind(this))
    this.middleware = router.routes()
    this.allowedMethods = router.allowedMethods()
  }

  /**
   * Generate random nonce for address.
   */
  async getChallenge (ctx: Router.IRouterContext) {
    const address = ctx.request.query.address
    const nonce = await this.authService.challenge(address)
    log.info('Send challenge nonce')
    ctx.response.body = { nonce }
  }

  async postChallenge (ctx: Router.IRouterContext) {
    const body = ctx.request.body
    const address = body.address
    const nonce = body.nonce
    const signature = body.signature

    // TODO Check origin against whitelist
    // TODO Check origin
    let isAccepted = await this.authService.canAccept(address, nonce, signature)

    ctx.response.body = { isAccepted }
    if (isAccepted) {
      if (ctx.session) {
        ctx.session.address = address
      } else {
        throw new Error('Session is not available in application')
      }
    } else {
      ctx.response.status = 400
    }
  }
}
