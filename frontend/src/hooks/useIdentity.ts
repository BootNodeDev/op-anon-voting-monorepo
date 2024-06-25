import { useCallback, useState } from 'react'

import { Identity } from '@semaphore-protocol/identity'
import { Address } from 'viem'
import { useSignMessage, useWriteContract } from 'wagmi'

import { contracts } from '../contracts/contracts'
import { useWeb3Connection } from '../providers/web3ConnectionProvider'
import { Maybe } from '@/types/utils'

// TODO Use current chain
const anonVoting = {
  address: contracts['AnonVoting']['address']['OP Mainnet'],
  abi: contracts['AnonVoting'].abi,
} as const

const MESSAGE = 'BOOT_NODE_ANON_VOTING'
const POLL_ID = 1 // TODO Receive as parameter on hook
const MT_DEPTH = 16
const PASSWORD = ''

export const useIdentity = () => {
  const { address } = useWeb3Connection()
  const { signMessage } = useSignMessage()
  const { writeContractAsync } = useWriteContract() // Replace after etherscan verification
  const [identity, setIdentity] = useState<Maybe<Identity>>(null)

  const createPoll = useCallback(async () => {
    if (!address) return
    await writeContractAsync({
      ...anonVoting,
      functionName: 'createPoll',
      args: [BigInt(POLL_ID), address, BigInt(MT_DEPTH)],
    })
  }, [address, writeContractAsync])

  const startPoll = useCallback(
    async () =>
      await writeContractAsync({
        ...anonVoting,
        functionName: 'startPoll',
        args: [BigInt(POLL_ID), BigInt(PASSWORD)],
      }),
    [writeContractAsync],
  )

  const createIdentity = useCallback(
    async () =>
      await signMessage(
        { account: address, message: MESSAGE },
        {
          onSuccess: (data) => {
            console.log(data)
            const id = new Identity(data.toString())
            setIdentity(id)
            console.log(id)
          },
        },
      ),
    [address, signMessage],
  )

  const addVoter = useCallback(
    async (commitment: string, uid: Address) => {
      console.log({ commitment, uid })
      await writeContractAsync({
        ...anonVoting,
        functionName: 'addVoter',
        args: [BigInt(POLL_ID), BigInt(commitment), uid],
      })
        .then((hash) => {
          console.log({ voterAddedHash: hash })
        })
        .catch((e) => {
          console.error(e)
        })
    },
    [writeContractAsync],
  )

  // const tx = useTransaction()

  return { identity, createIdentity, createPoll, addVoter, startPoll }
}
