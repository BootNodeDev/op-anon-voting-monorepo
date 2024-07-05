import { numberToHex } from 'viem'
import { optimism } from 'viem/chains'

import { getProviderUrl } from './providers'
import { ChainNames } from './wagmi'
import { ChainConfig } from '@/types/chains'

export const chainsConfig: Record<ChainNames, ChainConfig> = {
  'OP Mainnet': {
    ...optimism,
    chainIdHex: numberToHex(optimism.id),
    rpcUrl: getProviderUrl('OP Mainnet'),
    token: optimism.nativeCurrency.symbol,
    blockExplorerUrls: [optimism.blockExplorers.default.url, 'https://optimistic.etherscan.io'],
    subgraphUri: process.env.NEXT_PUBLIC_SUBGRAPH_URI ?? '',
  },
}

export const getNetworkConfig = (chainKey: ChainNames) => chainsConfig[chainKey]
