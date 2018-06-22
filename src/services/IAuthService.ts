import AuthNonce from '../domain/AuthNonce'
import Address from '../domain/Address'
import HexString from '../domain/HexString'

export default interface IAuthService {
  challenge (address: Address): Promise<AuthNonce>
  canAccept (address: Address, nonce: AuthNonce, signature: HexString): Promise<boolean>
}
