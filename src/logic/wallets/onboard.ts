import Onboard from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'

import { loadFromStorageWithExpiry, removeFromStorageWithExpiry, saveToStorageWithExpiry } from 'src/utils/storage'
import { store } from 'src/store'
import updateProviderWallet from 'src/logic/wallets/store/actions/updateProviderWallet'
import updateProviderAccount from 'src/logic/wallets/store/actions/updateProviderAccount'
import updateProviderNetwork from 'src/logic/wallets/store/actions/updateProviderNetwork'
import { closeAllNotifications } from '../notifications/store/notifications'
import { checksumAddress } from 'src/utils/checksumAddress'
import { WALLET_CONNECT_PROJECT_ID } from 'src/utils/constants'

const LAST_USED_PROVIDER_KEY = 'SAFE__lastUsedProvider'

export const saveLastUsedProvider = (name: string): void => {
  const expireInDays = (days: number) => 60 * 60 * 24 * 1000 * days
  const expiry = expireInDays(365)
  saveToStorageWithExpiry(LAST_USED_PROVIDER_KEY, name, expiry)
}

export const loadLastUsedProvider = (): string | undefined => {
  return loadFromStorageWithExpiry<string>(LAST_USED_PROVIDER_KEY)
}

export const removeLastUsedProvider = (): void => {
  removeFromStorageWithExpiry(LAST_USED_PROVIDER_KEY)
}

export const BLOCK_POLLING_INTERVAL = 1000 * 60 * 60 // 1 hour

const getOnboard = () => {
  const fuse = {
    id: '0x7A',
    token: 'Fuse',
    label: 'Fuse Mainnet',
    rpcUrl: 'https://rpc.fuse.io',
    blockExplorerUrl: 'https://explorer.fuse.io',
  }

  const wcV2InitOptions = {
    projectId: WALLET_CONNECT_PROJECT_ID,
    requiredChains: [122],
    dappUrl: 'https://safe.fuse.io',
  }

  const injected = injectedModule()
  const walletConnect = walletConnectModule(wcV2InitOptions)

  const wallets = [injected, walletConnect]

  const chains = [fuse]

  return Onboard({
    wallets,
    chains,
  })
}

let currentOnboardInstance
const onboard: any = () => {
  if (!currentOnboardInstance) {
    currentOnboardInstance = getOnboard()
  }

  return currentOnboardInstance
}

const state = onboard().state.select()
state.subscribe((update) => {
  store.dispatch(updateProviderWallet(update?.wallets[0]?.label || ''))

  store.dispatch(updateProviderAccount(checksumAddress(update?.wallets[0]?.accounts[0]?.address) || ''))

  store.dispatch(updateProviderNetwork(update?.wallets[0]?.chains[0]?.id?.toString() || ''))
  store.dispatch(closeAllNotifications())
})

export default onboard
