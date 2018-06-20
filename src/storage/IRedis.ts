export default interface IRedis {
  setex: (key: string, duration: number, value: string, cb: (err?: Error) => void) => void
}
