import * as Koa from 'koa'
import * as Router from 'koa-router'

export interface IBodyRequest extends Koa.Request {
  body: object
}

/**
 * HTTP Context for Koa application based on our set of plugins, like Router, and body-parser.
 */
export default interface IEndpointContext extends Router.IRouterContext {
  request: IBodyRequest
}
