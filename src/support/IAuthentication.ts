import HexString from '../domain/HexString'
import Address from '../domain/Address'
import AuthNonce from '../domain/AuthNonce'

export default interface IAuthentication {
  proveAddress (address: Address, nonce: AuthNonce): Promise<HexString>
  recoverAddress (address: Address, nonce: AuthNonce, signature: HexString): Promise<Address>
}
