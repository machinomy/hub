import AuthNonce from '../../domain/AuthNonce'
import Address from '../../domain/Address'
import HexString from '../../domain/HexString'
import Logger from '../../support/Logger'

const log = new Logger('backend')

export interface Indexed {
  [k: string]: string
}

async function get(url: string, params?: Indexed) {
  let _url = new URL(url)
  if (params) {
    Object.keys(params).forEach(key => _url.searchParams.append(key, params[key]))
  }
  return fetch(_url.toString(), { credentials: 'include' })
}

async function post(url: string, params: Indexed) {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(params)
  })
}

export class AuthBackend {
  constructor (private hubUrl: string) { }

  async getChallenge (address: Address): Promise<AuthNonce> {
    let result = await get(`${this.hubUrl}/auth/challenge`, { address })
    let resultJson = await result.json()
    return resultJson.nonce
  }

  async postChallenge (address: Address, nonce: AuthNonce, signature: HexString): Promise<boolean> {
    let url = `${this.hubUrl}/auth/challenge`
    let result = await post(url, { address, nonce, signature })
    if (result.status === 200) {
      log.info('Challenge response accepted')
      return true
    } else {
      log.info(`Challenge response rejected for address ${address}`)
      return false
    }
  }

  async getMe (): Promise<Address | null> {
    let url = `${this.hubUrl}/auth/challenge`
    let result = await get(url)
    if (result.ok) {
      let json = await result.json()
      return json.address
    } else {
      return null
    }
  }
}

export default class Backend {
  auth: AuthBackend

  constructor (hubUrl: string) {
    this.auth = new AuthBackend(hubUrl)
  }
}
