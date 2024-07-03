import { ChainNames } from './wagmi'
import { ObjectValues, RPCProviders, RPCProvidersENV } from '@/types/utils'

export const providerChains: Record<RPCProviders, Record<ChainNames, string>> = {
  infura: {
    'OP Mainnet': 'optimism-mainnet',
  },
  alchemy: {
    'OP Mainnet': 'opt-mainnet',
  },
}

const getInfuraRPCUrl = (chainKey: ChainNames) =>
  `https://${providerChains['infura'][chainKey]}.infura.io/v3/${RPCProvidersENV['infura']}`

const getAlchemyRPCUrl = (chainKey: ChainNames) =>
  `https://${providerChains['alchemy'][chainKey]}.g.alchemy.com/v2/${RPCProvidersENV['alchemy']}`

export const getProviderUrl = (chainKey: ChainNames, provider?: ObjectValues<RPCProviders>) => {
  if (!RPCProvidersENV['infura'] && !RPCProvidersENV['alchemy']) {
    throw new Error(`You must set infura/alchemy token provider in environment variable`)
  }

  //Manual provider
  if (provider === 'infura' && RPCProvidersENV['infura']) return getInfuraRPCUrl(chainKey)

  if (provider === 'alchemy' && RPCProvidersENV['alchemy']) return getAlchemyRPCUrl(chainKey)

  // Auto-magic provider
  if (RPCProvidersENV['infura']) return getInfuraRPCUrl(chainKey)
  if (RPCProvidersENV['alchemy']) return getAlchemyRPCUrl(chainKey)

  throw Error('Token provider could not be found')
}
