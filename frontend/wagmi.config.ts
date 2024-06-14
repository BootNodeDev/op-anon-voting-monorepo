import { defineConfig } from '@wagmi/cli'
import { etherscan, react } from '@wagmi/cli/plugins'
import { erc20Abi } from 'viem'
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
          name: 'ApeNFT',
          address: {
            [optimism.id]: '0x0deaAc29d8A3d4EbBAAa3eCd3cC97C9deF00f720',
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
