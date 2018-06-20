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
    const address = ctx.query.address
    const nonce = await this.authService.challenge(address)
    log.info('Send challenge nonce')
    ctx.body = { nonce }
  }

  async postChallenge (ctx: Router.IRouterContext) {
    const body = ctx.request.body
    const address = body.address
    const nonce = body.nonce
    const signature = body.signature

    // TODO Add validation for the fields
    // TODO Check origin against whitelist
    // TODO Check origin
    // TODO Save in session
    let isAccepted = await this.authService.canAccept(address, nonce, signature)

    ctx.body = { isAccepted }
    if (!isAccepted) ctx.res.statusCode = 400

    // const address = req.body.address
    //     const nonce = req.body.nonce
    //     const origin = req.body.origin
    //     const signature = req.body.signature
    //
    //     if (!address || !nonce || !origin || !signature) {
    //       LOG.warn('Received invalid challenge request. Aborting. Body received: {body}', {
    //         body: req.body
    //       })
    //       return res.sendStatus(400)
    //     }
    //
    //     if (this.config.authDomainWhitelist.indexOf(origin) === -1) {
    //       LOG.warn('Received auth challenge from invalid origin: {origin}', {
    //         origin
    //       })
    //       return res.sendStatus(400)
    //     }
    //
    //     let result: string | null
    //
    //     try {
    //       result = await this.crManager.checkSignature(address, nonce, origin, signature)
    //     } catch (err) {
    //       LOG.error('Caught error checking signature: {err}', {
    //         err
    //       })
    //       return res.sendStatus(400)
    //     }
    //
    //     if (!result) {
    //       LOG.warn('Received invalid challenge response. Aborting.')
    //       return res.sendStatus(400)
    //     }
    //
    //     req.session!.regenerate(async (err) => {
    //       if (err) {
    //         LOG.error('Caught error while regenerating session: {err}', {
    //           err
    //         })
    //         return res.sendStatus(500)
    //       }
    //
    //       req.session!.address = result
    //       res.send({ token: req.session!.id })
    //     })
  }
}
