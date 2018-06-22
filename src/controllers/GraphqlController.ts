import * as Router from 'koa-router'
import { Middleware } from 'koa'
import { graphqlKoa } from 'apollo-server-koa'
import GraphqlService from '../services/GraphqlService'

export default class GraphqlController {
  readonly middleware: Middleware
  readonly allowedMethods: Middleware

  constructor (gqlService: GraphqlService) {
    let router = new Router()
    let engine = graphqlKoa(ctx => {
      return {
        schema: gqlService.schema(ctx)
      }
    })
    router.post('/', engine)
    router.get('/', engine)
    this.middleware = router.routes()
    this.allowedMethods = router.allowedMethods()
  }
}
