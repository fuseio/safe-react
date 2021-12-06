import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { default as networks } from 'src/config/networks'

const { fuse } = networks

const fuseShortName = fuse.network.shortName

const validSafeAddress = '0x7585ed0C5e8D5F09ad2dA7f52b85B71d038F8654'

describe('Config Services', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it(`should load 'test' network config`, () => {
    // Given
    const { getNetworkInfo } = require('src/config')

    // When
    const networkInfo = getNetworkInfo()

    // Then
    expect(networkInfo.id).toBe(ETHEREUM_NETWORK.SPARK)
  })

  it(`should load 'fuse' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: '',
    }))
    window.history.pushState(null, '', `${window.location.origin}/app/${fuseShortName}:${validSafeAddress}`)
    const { getNetworkInfo } = require('src/config')

    // When
    const networkInfo = getNetworkInfo()

    // Then
    expect(networkInfo.id).toBe(ETHEREUM_NETWORK.FUSE)
  })

  it(`should load 'fuse.dev' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: '',
    }))
    window.history.pushState(null, '', `${window.location.origin}/app/${fuseShortName}:${validSafeAddress}`)
    const { getTxServiceUrl } = require('src/config')
    const TX_SERVICE_URL = fuse.environment.dev?.txServiceUrl

    // When
    const txServiceUrl = getTxServiceUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
  })

  it(`should load 'fuse.staging' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: 'production',
    }))
    window.history.pushState(null, '', `${window.location.origin}/app/${fuseShortName}:${validSafeAddress}`)
    const { getTxServiceUrl } = require('src/config')
    const TX_SERVICE_URL = fuse.environment.staging?.txServiceUrl

    // When
    const txServiceUrl = getTxServiceUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
  })

  it(`should load 'mainnet.production' network config`, () => {
    // Given
    jest.mock('src/utils/constants', () => ({
      NODE_ENV: 'production',
      APP_ENV: 'production',
    }))
    window.history.pushState(null, '', `${window.location.origin}/app/${fuseShortName}:${validSafeAddress}`)
    const { getTxServiceUrl } = require('src/config')
    const TX_SERVICE_URL = fuse.environment.production.txServiceUrl

    // When
    const txServiceUrl = getTxServiceUrl()

    // Then
    expect(TX_SERVICE_URL).toBe(txServiceUrl)
  })
})
