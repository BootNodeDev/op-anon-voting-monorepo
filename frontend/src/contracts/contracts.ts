import { Abi, Address, erc20Abi } from 'viem'

import { ChainNames } from '../config/wagmi'
import ERC_20_abi from '@/src/contracts/abis/ERC20.abi'

export type ContractsKeys = 'DAI' | 'USDC'

export const contracts: Record<ContractsKeys, { address: Record<ChainNames, Address>; abi: Abi }> =
  {
    DAI: {
      address: {
        'OP Mainnet': '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        'OP Sepolia': '0x0091f4e75a03C11cB9be8E3717219005eb780D89',
      },
      abi: ERC_20_abi, // Left as an example of custom abi
    },
    USDC: {
      address: {
        'OP Mainnet': '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
        'OP Sepolia': '0x87350147a24099Bf1e7E677576f01C1415857C75', // TODO Check
      },
      abi: erc20Abi,
    },
  } as const

export const isKnownContract = (
  contractName: ContractsKeys | string,
): contractName is ContractsKeys => {
  return contracts[contractName as ContractsKeys] !== undefined
}
