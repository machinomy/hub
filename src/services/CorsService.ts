import * as cors from '@koa/cors'
import {Context, Middleware} from 'koa';
import ICorsService from './ICorsService';

export default class CorsService implements ICorsService {
  middleware: Middleware

  constructor () {
    this.middleware = cors({
      credentials: true,
      origin: this.handler.bind(this)
    })
  }

  handler (ctx: Context) {
    let origin = ctx.headers.origin
    // TODO Check against whitelist or something
    return origin
  }
}
