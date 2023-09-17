import { Wallet } from 'bnc-onboard/dist/src/interfaces'
import onboard from 'src/logic/wallets/onboard'
import { hexToNumberString, isHexStrict, numberToHex } from 'web3-utils'

import { getChainInfo, getExplorerUrl, getPublicRpcUrl, _getChainId } from 'src/config'
import { ChainId } from 'src/config/chain.d'
import { Errors, CodedException } from 'src/logic/exceptions/CodedException'
import { isHardwareWallet } from '../getWeb3'
import { WalletState } from '@web3-onboard/core'

const WALLET_ERRORS = {
  UNRECOGNIZED_CHAIN: 4902,
  USER_REJECTED: 4001,
  // ADDING_EXISTING_CHAIN: -32603,
}

/**
 * Add a chain config based on EIP-3085.
 * Known to be implemented by MetaMask.
 * @see https://docs.metamask.io/guide/rpc-api.html#wallet-addethereumchain
 */
const requestAdd = async (wallet: WalletState, chainId: ChainId): Promise<void> => {
  const { chainName, nativeCurrency } = getChainInfo()

  await wallet.provider?.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: numberToHex(chainId),
        chainName,
        nativeCurrency,
        rpcUrls: [getPublicRpcUrl()],
        blockExplorerUrls: [getExplorerUrl()],
      },
    ],
  })
}

/**
 * Try switching the wallet chain, and if it fails, try adding the chain config
 */
export const switchNetwork = async (wallet: WalletState, chainId: ChainId): Promise<void> => {
  try {
    await onboard().setChain({ wallet: wallet.label, chainId: numberToHex(chainId) })
  } catch (e) {
    if (e.code === WALLET_ERRORS.USER_REJECTED) {
      return
    }

    if (e.code == WALLET_ERRORS.UNRECOGNIZED_CHAIN) {
      try {
        await requestAdd(wallet, chainId)
      } catch (e) {
        if (e.code === WALLET_ERRORS.USER_REJECTED) {
          return
        }

        throw new CodedException(Errors._301, e.message)
      }
    } else {
      throw new CodedException(Errors._300, e.message)
    }
  }
}

export const shouldSwitchNetwork = (wallet: Wallet): boolean => {
  if (!wallet.provider || isHardwareWallet(wallet)) {
    return false
  }

  // The current network can be stored under one of two keys
  const isCurrentNetwork = [wallet?.provider?.networkVersion, wallet?.provider?.chainId].some((chainId) => {
    const _chainId = _getChainId()

    if (typeof chainId === 'number') {
      return chainId.toString() === _chainId
    }
    if (typeof chainId === 'string') {
      return isHexStrict(chainId) ? hexToNumberString(chainId) === _chainId : chainId === _chainId
    }
    return false
  })

  return !isCurrentNetwork
}

export const switchWalletChain = async (): Promise<void> => {
  const [wallet] = onboard().state.get().wallets
  try {
    await switchNetwork(wallet, _getChainId())
  } catch (e) {
    e.log()
    await onboard().connectWallet()
  }
}
