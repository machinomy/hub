import AuthNonce from '../domain/AuthNonce'
import Address from '../domain/Address'
import HexString from '../domain/HexString'

export default interface IAuthService {
  generateChallenge (address: Address): Promise<AuthNonce>
  acceptChallenge (address: Address, nonce: AuthNonce, signature: HexString): Promise<boolean>
}
