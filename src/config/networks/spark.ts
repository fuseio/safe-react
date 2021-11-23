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
  clientGatewayUrl: 'http://ec2-3-124-115-95.eu-central-1.compute.amazonaws.com:8000/cgw/v1',
  txServiceUrl: 'http://ec2-3-124-115-95.eu-central-1.compute.amazonaws.com:8000/txs/api/v1',
  gasPrice: 1e9, // 1 Gwei TODO: add gasPriceOracles
  rpcServiceUrl: 'https://rpc.fusespark.io',
  safeAppsRpcServiceUrl: 'https://rpc.fusespark.io',
  networkExplorerName: 'Fuse Explorer',
  networkExplorerUrl: 'https://explorer.fusespark.io',
  networkExplorerApiUrl: 'https://explorer.fusespark.io/api',
}

const spark: NetworkConfig = {
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
    id: ETHEREUM_NETWORK.SPARK,
    shortName: SHORT_NAME.SPARK,
    backgroundColor: '#a3eb71',
    textColor: '#0d004d',
    label: 'Spark',
    ethereumLayer: ETHEREUM_LAYER.L2,
    nativeCoin: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Spark',
      symbol: 'SPARK',
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

export default spark