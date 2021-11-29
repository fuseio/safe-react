import FuseLogo from 'src/config/assets/token_fuse.svg'
import {
  EnvironmentSettings,
  ETHEREUM_LAYER,
  ETHEREUM_NETWORK,
  FEATURES,
  NetworkConfig,
  SHORT_NAME,
  WALLETS,
} from 'src/config/networks/network.d'

const baseConfig: EnvironmentSettings = {
  clientGatewayUrl: 'https://safe-service.fuse.io/cgw/v1',
  txServiceUrl: 'https://safe-service.fuse.io/txs/api/v1',
  gasPrice: 1e9, // 1 Gwei TODO: add gasPriceOracles
  rpcServiceUrl: 'https://rpc.fuse.io',
  safeAppsRpcServiceUrl: 'https://rpc.fuse.io',
  networkExplorerName: 'Fuse Explorer',
  networkExplorerUrl: 'https://explorer.fuse.io',
  networkExplorerApiUrl: 'https://explorer.fuse.io/api',
}

const fuse: NetworkConfig = {
  environment: {
    dev: {
      ...baseConfig,
    },
    staging: {
      ...baseConfig,
    },
    production: {
      ...baseConfig,
    },
  },
  network: {
    id: ETHEREUM_NETWORK.FUSE,
    shortName: SHORT_NAME.FUSE,
    backgroundColor: '#a3eb71',
    textColor: '#0d004d',
    label: 'Fuse',
    ethereumLayer: ETHEREUM_LAYER.L2,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Fuse',
      symbol: 'FUSE',
      decimals: 18,
      logoUri: FuseLogo,
    },
  },
  disabledWallets: [
    WALLETS.TREZOR,
    WALLETS.LEDGER,
    WALLETS.COINBASE,
    WALLETS.FORTMATIC,
    WALLETS.OPERA,
    WALLETS.OPERA_TOUCH,
    WALLETS.PORTIS,
    WALLETS.TORUS,
    WALLETS.TRUST,
    WALLETS.WALLET_LINK,
    WALLETS.AUTHEREUM,
    WALLETS.LATTICE,
    WALLETS.KEYSTONE,
    WALLETS.WALLET_CONNECT,
  ],
  disabledFeatures: [FEATURES.DOMAIN_LOOKUP, FEATURES.SPENDING_LIMIT],
}

export default fuse
