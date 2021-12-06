import { getBalances, SafeBalanceResponse, TokenInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { ListItemSecondaryAction } from '@material-ui/core'
import { RepeatOneSharp } from '@material-ui/icons'
import { consoleSandbox } from '@sentry/utils'
import BigNumber from 'bignumber.js'
import { response } from 'express'
import { getBalancesHandler, getClientGatewayUrl, getCustomExchangePriceOracle, getNetworkId } from 'src/config'
import { BalancesHandler } from 'src/config/networks/network'
import { checksumAddress } from 'src/utils/checksumAddress'

export type TokenBalance = {
  tokenInfo: TokenInfo
  balance: string
  fiatBalance: string
  fiatConversion: string
}

type FetchTokenCurrenciesBalancesProps = {
  safeAddress: string
  selectedCurrency: string
  excludeSpamTokens?: boolean
  trustedTokens?: boolean
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const xDecimals = (x: string) => {
  return new BigNumber(10).pow(new BigNumber(x))
}

export const fuseBalancesHandler = async (balances: SafeBalanceResponse) : Promise<SafeBalanceResponse> => {
  let tmp = getCustomExchangePriceOracle()
  if(tmp === undefined) return balances

  let nativeAddress = tmp.wrappedNativeCurrencyAddress
  let url = tmp.exchangePriceAPI
  let fiatTotal = new BigNumber(0)

  balances.items = await Promise.all(balances.items.map(async (item) => {
    let tokenAddress = item.tokenInfo.address === ZERO_ADDRESS ? nativeAddress : item.tokenInfo.address
    try {
      let res = await fetch(url + tokenAddress)

      if(res.ok) {
        let price = new BigNumber((await res.json()).data.price)
        let balance = new BigNumber(item.balance)
        let fiatBalance = balance.multipliedBy(price).div(xDecimals("18")) // TODO: get Token decimals instead of the default 18

        item.fiatConversion = price.toString()
        item.fiatBalance = fiatBalance.toString()
      }

      fiatTotal = fiatTotal.plus(new BigNumber(item.fiatBalance))
      return item

    } catch (err) {
      console.error(err)

      fiatTotal = fiatTotal.plus(new BigNumber(item.fiatBalance))
      return item
    }

  }))

  balances.fiatTotal = fiatTotal.toString()

  return balances
}

export const fetchTokenCurrenciesBalances = async ({
  safeAddress,
  selectedCurrency,
  excludeSpamTokens = true,
  trustedTokens = false,
}: FetchTokenCurrenciesBalancesProps): Promise<SafeBalanceResponse> => {
  const address = checksumAddress(safeAddress)
  let ret = getBalances(getClientGatewayUrl(), getNetworkId().toString(), address, selectedCurrency, {
    exclude_spam: excludeSpamTokens,
    trusted: trustedTokens,
  })
  if(getBalancesHandler === undefined) {
    return ret
  }
  let balanceHandler = getBalancesHandler() as BalancesHandler
  return balanceHandler(await ret)

}
