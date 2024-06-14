import { numberToHex } from 'viem'
import { anvil, optimism, optimismSepolia } from 'viem/chains'

import { getProviderUrl } from './providers'
import { ChainNames } from './wagmi'
import { ChainConfig } from '@/types/chains'

export const chainsConfig: Record<ChainNames, ChainConfig> = {
  'OP Sepolia': {
    ...optimismSepolia,
    chainIdHex: numberToHex(optimismSepolia.id),
    rpcUrl: getProviderUrl('OP Sepolia'),
    token: optimismSepolia.nativeCurrency.symbol,
    blockExplorerUrls: [
      optimismSepolia.blockExplorers.default.url,
      'https://sepolia-optimism.etherscan.io',
    ],
  },
  'OP Mainnet': {
    ...optimism,
    chainIdHex: numberToHex(optimism.id),
    rpcUrl: getProviderUrl('OP Mainnet'),
    token: optimism.nativeCurrency.symbol,
    blockExplorerUrls: [optimism.blockExplorers.default.url, 'https://optimistic.etherscan.io'],
  },
  Anvil: {
    ...anvil,
    chainIdHex: numberToHex(anvil.id),
    rpcUrl: anvil.rpcUrls.default.http[0],
    token: anvil.nativeCurrency.symbol,
    blockExplorerUrls: [],
  },
}

export const getNetworkConfig = (chainKey: ChainNames) => chainsConfig[chainKey]
