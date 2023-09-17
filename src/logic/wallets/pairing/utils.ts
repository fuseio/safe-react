import { getDisabledWallets } from 'src/config'
import { WALLETS } from 'src/config/chain.d'
import onboard from 'src/logic/wallets/onboard'

export const initPairing = async (): Promise<void> => {
  await onboard().walletSelect()
}

// Is WC connected (may work for other providers)
export const isPairingConnected = (): boolean => {
  return onboard().state.get().wallets[0].provider.isConnected()
}

export const isPairingSupported = (): boolean => {
  return !getDisabledWallets().includes(WALLETS.SAFE_MOBILE)
}

// Is pairing module initialised
export const isPairingModule = (): boolean => {
  return false
}

export const getPairingUri = (): string | undefined => {
  const PAIRING_MODULE_URI_PREFIX = 'safe-'
  const wcUri = onboard().state.get().wallet.provider?.wc?.uri

  if (!wcUri || !/key=.+/.test(wcUri)) {
    return
  }

  return `${PAIRING_MODULE_URI_PREFIX}${wcUri}`
}
