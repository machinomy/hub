import * as Router from 'koa-router'
import Controllers from './controllers/Controllers'

/**
 * Set namespaces for controllers
 */
export default class Routes {
  public readonly middleware: Router.IMiddleware
  public readonly allowedMethods: Router.IMiddleware

  constructor (controllers: Controllers, isDevelopment: boolean) {

    let router = new Router()
    router.use('/payments', controllers.payments.middleware)
    router.use('/auth', controllers.auth.middleware)
    router.use('/auth', controllers.auth.allowedMethods)
    router.use('/dashboard', controllers.dashboard.middleware)
    router.use('/dashboard', controllers.dashboard.allowedMethods)
    router.use('/graphql', controllers.graphql.middleware)
    router.use('/graphql', controllers.graphql.allowedMethods)

    if (isDevelopment) {
      router.use('/graphiql', controllers.graphiql.middleware)
      router.use('/graphiql', controllers.graphiql.allowedMethods)
    }

    router.redirect('/', '/dashboard')
    router.use('/', controllers.assets.middleware)

    this.middleware = router.middleware()
    this.allowedMethods = router.allowedMethods()
  }
}
