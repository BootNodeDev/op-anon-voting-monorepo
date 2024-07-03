import { defineConfig } from '@wagmi/cli'
import { etherscan, react } from '@wagmi/cli/plugins'
import { Address, erc20Abi } from 'viem'
import { optimism, optimismSepolia } from 'wagmi/chains'

import env from './src/config/env.server'

const config = defineConfig({
  out: 'src/hooks/generated/hooks.ts',
  contracts: [
    {
      name: 'erc20',
      abi: erc20Abi,
    },
  ],
  plugins: [
    etherscan({
      apiKey: env.ETHERSCAN_API_KEY,
      chainId: optimism.id,
      contracts: [
        {
          name: 'AnonVoting',
          address: {
            [optimism.id]: process.env.NEXT_PUBLIC_ANON_VOTING_ADDRESS as Address,
          },
        },
        {
          name: 'EASAttestation',
          address: {
            [optimism.id]: '0x4200000000000000000000000000000000000021',
            [optimismSepolia.id]: '0x4200000000000000000000000000000000000021',
          },
        },
        {
          name: 'EAS Schema Registry',
          address: {
            [optimism.id]: '0x4200000000000000000000000000000000000020',
            [optimismSepolia.id]: '0x4200000000000000000000000000000000000020',
          },
        },
      ],
    }),
    react(),
  ],
})

export default config
