import { ZERO_ADDRESS } from '@/src/constants/bigNumber'
import AnonVotingAbi from '@/src/contracts/abis/AnonVoting.abi'

export type ContractsKeys = 'AnonVoting'

export const contracts = {
  AnonVoting: {
    address: {
      'OP Mainnet': process.env.NEXT_PUBLIC_ANON_VOTING_ADDRESS,
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
