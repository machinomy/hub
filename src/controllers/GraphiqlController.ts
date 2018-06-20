import * as Router from 'koa-router'
import { Middleware } from 'koa'
import { graphiqlKoa } from 'apollo-server-koa'

export default class GraphiqlController {
  readonly middleware: Middleware
  readonly allowedMethods: Middleware

  constructor () {
    let router = new Router()
    let engine = graphiqlKoa({
        endpointURL: '/graphql', // a POST endpoint that GraphiQL will make the actual requests to
      })
    router.get('/', engine)
    this.middleware = router.routes()
    this.allowedMethods = router.allowedMethods()
  }
}
