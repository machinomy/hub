import Address from '../domain/Address'
import AuthNonce from '../domain/AuthNonce'

export default interface IAuthNonceDatabase {
  save (address: Address, nonce: AuthNonce): Promise<void>
  isPresent (address: Address, nonce: AuthNonce): Promise<boolean>
}
