import { createConfig, http } from 'wagmi'
import { anvil, optimism, optimismSepolia } from 'wagmi/chains'

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

export const chains = [optimism, optimismSepolia, anvil] as const

export const config = createConfig({
  chains,
  transports: {
    [optimism.id]: http(),
    [optimismSepolia.id]: http(),
    [anvil.id]: http('http://127.0.0.1:8545'),
  },
})

export const chainIds = chains.map((c) => c.id)
const chainNames = chains.map((c) => c.name)

export type ChainIds = (typeof chainIds)[number]
export type ChainNames = (typeof chainNames)[number]

export const mapId2Name: Record<ChainIds, ChainNames> = {
  10: 'OP Mainnet',
  11155420: 'OP Sepolia',
  31337: 'Anvil',
} as const

export const chainIdsArray = ['10', '11155420', '31337'] as const
