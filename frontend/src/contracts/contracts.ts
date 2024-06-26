import { Abi, Address } from 'viem'

import AnonVotingAbi from './abis/AnonVoting.abi'
import { ChainNames } from '../config/wagmi'
import { ZERO_ADDRESS } from '../constants/bigNumber'

export type ContractsKeys = 'AnonVoting'

export const contracts: Record<ContractsKeys, { address: Record<ChainNames, Address>; abi: Abi }> =
  {
    AnonVoting: {
      address: {
        'OP Mainnet': ZERO_ADDRESS, // TODO deploy
        'OP Sepolia': ZERO_ADDRESS, // TODO deploy,
        Anvil: '0xdc64a140aa3e981100a9beca4e685f962f0cf6c9',
      },
      abi: AnonVotingAbi, // Left as an example of custom abi
    },
  } as const

export const isKnownContract = (
  contractName: ContractsKeys | string,
): contractName is ContractsKeys => {
  return contracts[contractName as ContractsKeys] !== undefined
}
