import {Middleware} from 'koa';

export default interface ICorsService {
  middleware: Middleware
}
