import AnonVotingAbi from '@/src/contracts/abis/AnonVoting.abi'

export type ContractsKeys = 'AnonVoting'

export const contracts = {
  AnonVoting: {
    address: {
      'OP Mainnet': process.env.NEXT_PUBLIC_ANON_VOTING_ADDRESS,
    },
    abi: AnonVotingAbi, // Left as an example of custom abi
  },
} as const

export const isKnownContract = (
  contractName: ContractsKeys | string,
): contractName is ContractsKeys => {
  return contracts[contractName as ContractsKeys] !== undefined
}
