import * as expect from 'expect'
import AuthNonceDatabase from './AuthNonceDatabase'
import {RedisClient} from "redis";

function database(implementation: any) {
  const DummyRedisClient = jest.fn<RedisClient>(() => implementation)
  const client = new DummyRedisClient()
  const db = new AuthNonceDatabase(client)
  return { db, client }
}

test('save', async () => {
  const { db, client } = database({
    set: jest.fn((k, v, cb) => {
      cb()
    }),
    expire: jest.fn((k, ttl, cb) => {
      cb()
    })
  })
  await db.save('0xadd4', 'nonce')
  expect(client.set).toHaveBeenCalled()
  expect(client.expire).toHaveBeenCalled()
})

test('isPresent: true', async () => {
  const NONCE = 'nonce'
  const { db, client } = database({
    get: jest.fn((k, cb) => {
      cb(null, NONCE)
    })
  })

  let result = await db.isPresent('0xadd4', 'nonce')
  expect(result).toBeTruthy()
  expect(client.get).toHaveBeenCalled()
})

test('isPresent: false', async () => {
  const { db, client } = database({
    get: jest.fn((k, cb) => {
      cb(null)
    })
  })

  let result = await db.isPresent('0xadd4', 'nonce')
  expect(result).toBeFalsy()
  expect(client.get).toHaveBeenCalled()
})
