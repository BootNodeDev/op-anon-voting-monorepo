import { useCallback, useEffect, useState } from 'react'

import { Group } from '@semaphore-protocol/group'
import { Identity } from '@semaphore-protocol/identity'
import { generateProof } from '@semaphore-protocol/proof'
import { Address } from 'viem'
import { useSignMessage, useWriteContract } from 'wagmi'

import { contracts } from '@/src/contracts/contracts'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { Maybe } from '@/types/utils'

// TODO Use current chain
const anonVoting = {
  address: contracts['AnonVoting']['address']['OP Mainnet'] as Address,
  abi: contracts['AnonVoting'].abi,
} as const

const MESSAGE = 'BOOT_NODE_ANON_VOTING'
const MT_DEPTH = 32
const PASSWORD = ''

export const useIdentity = (pollIdProp: bigint) => {
  const { address } = useWeb3Connection()
  const [pollId, setPollId] = useState(pollIdProp)

  const { signMessage } = useSignMessage()
  const { writeContractAsync } = useWriteContract() // TODO Replace with hooks after etherscan verification
  const [identity, setIdentity] = useState<Maybe<Identity>>(null)

  useEffect(() => {
    setPollId(pollIdProp)
  }, [pollIdProp])

  const makeProof = useCallback(
    async (vote: bigint) => {
      if (!identity) throw Error('no identity')
      const externalNullifier = pollId

      const group = new Group(pollId, MT_DEPTH, [])
      group.addMember(identity.getCommitment().toString())

      const proof = await generateProof(identity, group, externalNullifier, vote)

      return proof
    },
    [identity, pollId],
  )

  const createPoll = useCallback(
    async (coordinator: Address) => {
      await writeContractAsync({
        ...anonVoting,
        functionName: 'createPoll',
        args: [BigInt(pollId), coordinator, BigInt(MT_DEPTH)],
      })
    },
    [pollId, writeContractAsync],
  )

  const startPoll = useCallback(
    async () =>
      await writeContractAsync({
        ...anonVoting,
        functionName: 'startPoll',
        args: [BigInt(pollId), BigInt(PASSWORD)],
      }),
    [pollId, writeContractAsync],
  )

  const createIdentity = useCallback(
    async (message = MESSAGE) =>
      await signMessage(
        { account: address, message },
        {
          onSuccess: (data) => {
            const id = new Identity(data.toString())
            setIdentity(id)
          },
        },
      ),
    [address, signMessage],
  )

  const addVoter = useCallback(
    async (commitment: string, uid: Address) => {
      await writeContractAsync({
        ...anonVoting,
        functionName: 'addVoter',
        args: [BigInt(pollId), BigInt(commitment), uid],
      }).catch((e) => {
        console.error(e)
      })
    },
    [pollId, writeContractAsync],
  )

  const endPoll = useCallback(async () => {
    await writeContractAsync({
      ...anonVoting,
      functionName: 'endPoll',
      args: [BigInt(pollId), BigInt(PASSWORD)],
    })
      .then((hash) => {
        console.log({ voterAddedHash: hash })
      })
      .catch((e) => {
        console.error(e)
      })
  }, [pollId, writeContractAsync])

  const castVote = useCallback(
    async (vote: number) => {
      const proofObject = await makeProof(BigInt(vote))
      const { externalNullifier, nullifierHash, proof } = proofObject

      const signal = BigInt(vote)

      await writeContractAsync({
        ...anonVoting,
        functionName: 'castVote',
        args: [signal, nullifierHash, externalNullifier, proof],
      }).catch((e) => {
        console.error(e)
      })
    },
    [makeProof, writeContractAsync],
  )

  return { identity, createIdentity, createPoll, addVoter, startPoll, endPoll, castVote }
}
