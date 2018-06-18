import * as Router from 'koa-router'
import PaymentsController from './controllers/PaymentsController'
import DashboardController from './controllers/DashboardController'
import AssetsController from './controllers/AssetsController'

/**
 * Set namespaces for controllers
 */
export default class Routes {
  private readonly payments: PaymentsController
  public readonly middleware: Router.IMiddleware

  constructor (dashboard: DashboardController, payments: PaymentsController, assets: AssetsController) {
    this.payments = payments

    let router = new Router()
    router.use('/payments', payments.middleware)
    router.use('/dashboard', dashboard.middleware)
    router.redirect('/', '/dashboard')
    router.use('/', assets.middleware)
    this.middleware = router.middleware()
  }
}
