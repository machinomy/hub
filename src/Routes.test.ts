import * as request from 'supertest'
import * as Koa from 'koa'
import Registry from './Registry'
import Configuration from './Configuration'
import { RedisClient } from 'redis'

const app = new Koa()

beforeAll(async () => {
  const configuration = await Configuration.env()
  const redisClient = jest.fn<RedisClient>()
  const registry = await Registry.build(configuration)
  jest.spyOn(registry, 'redisClient').mockReturnValue(Promise.resolve(redisClient))
  const routes = await registry.routes()

  app.use(routes.middleware)
})

test('GET / redirect to /dashboard', async () => {
  const response = await request(app.callback()).get('/')
  expect(response.redirect).toBe(true)
  expect(response.header['location']).toBe('/dashboard')
  expect(response.body).toEqual({})
})
