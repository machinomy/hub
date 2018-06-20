import IRedis from '../storage/IRedis'

export default class DummyRedisClient implements IRedis {
  setex (key: string, ttl: number, value: string, cb: (err?: Error) => void) {
    cb()
  }
}
