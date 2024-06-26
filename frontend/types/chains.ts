import { Chain } from 'viem'

export type ChainConfig = Chain & {
  chainIdHex: string
  rpcUrl: string
  token: string
  blockExplorerUrls: string[]
  subgraphUri: string
}
