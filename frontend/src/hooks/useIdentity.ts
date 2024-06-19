import { useCallback } from 'react'

import { Identity } from '@semaphore-protocol/identity'
import { useSignMessage, useWriteContract } from 'wagmi'

import { contracts } from '../contracts/contracts'
import { useWeb3Connection } from '../providers/web3ConnectionProvider'

const anonVoting = {
  address: contracts['AnonVoting']['address'].Anvil,
  abi: contracts['AnonVoting'].abi,
} as const

const MESSAGE = 'BOOT_NODE_ANON_VOTING'
const POLL_ID = 1
const MT_DEPTH = 16

export const useIdentity = () => {
  const { address } = useWeb3Connection()
  const { signMessage } = useSignMessage()
  const { writeContractAsync } = useWriteContract() // Replace after etherscan verification

  const createIdentity = useCallback(async () => {
    await writeContractAsync({
      ...anonVoting,
      functionName: 'createPoll',
      args: [POLL_ID, address, MT_DEPTH],
    })

    await writeContractAsync({
      ...anonVoting,
      functionName: 'startPoll',
      args: [POLL_ID, ''],
    })

    await signMessage(
      { account: address, message: MESSAGE },
      {
        onSuccess: (data) => {
          console.log(data)
          const identity = new Identity(data.toString())
          console.log(identity)
          writeContractAsync({
            ...anonVoting,
            functionName: 'addVoter',
            args: [POLL_ID, identity.getCommitment()],
          })
            .then((hash) => {
              console.log({ voterAddedHash: hash })
            })
            .catch((e) => {
              console.error(e)
            })
        },
      },
    )
  }, [address, signMessage, writeContractAsync])
  // const tx = useTransaction()

  return { createIdentity }
}
