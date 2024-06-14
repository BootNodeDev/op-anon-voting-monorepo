import { createConfig, http } from 'wagmi'
import { optimism, optimismSepolia } from 'wagmi/chains'

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

export const chains = [optimism, optimismSepolia] as const

export const config = createConfig({
  chains,
  transports: {
    [optimism.id]: http(),
    [optimismSepolia.id]: http(),
  },
})

export const chainIds = chains.map((c) => c.id)
const chainNames = chains.map((c) => c.name)

export type ChainIds = (typeof chainIds)[number]
export type ChainNames = (typeof chainNames)[number]

export const mapId2Name: Record<ChainIds, ChainNames> = {
  10: 'OP Mainnet',
  11155420: 'OP Sepolia',
} as const

export const chainIdsArray = ['10', '11155420'] as const
