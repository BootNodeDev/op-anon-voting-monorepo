import { useCallback, useEffect, useState } from 'react'

import { Identity } from '@semaphore-protocol/identity'
import { generateProof } from '@semaphore-protocol/proof'
import { Address } from 'viem'
import { useReadContract, useSignMessage, useWriteContract } from 'wagmi'

import { contracts } from '../contracts/contracts'
import { useWeb3Connection } from '../providers/web3ConnectionProvider'
import { Maybe } from '@/types/utils'

// TODO Use current chain
const anonVoting = {
  address: contracts['AnonVoting']['address']['OP Mainnet'] as Address,
  abi: contracts['AnonVoting'].abi,
} as const

const MESSAGE = 'BOOT_NODE_ANON_VOTING'
const MT_DEPTH = 16
const PASSWORD = ''

export const useIdentity = (pollIdProp: bigint) => {
  const { address } = useWeb3Connection()
  const [pollId, setPollId] = useState(pollIdProp)

  const { signMessage } = useSignMessage()
  const { data: mkTreeRoot } = useReadContract({
    abi: anonVoting.abi,
    address: anonVoting.address as Address,
    functionName: 'getMerkleTreeRoot',
    args: [pollId],
  })
  console.log({ mkTreeRoot })
  const { writeContractAsync } = useWriteContract() // TODO Replace with hooks after etherscan verification
  const [identity, setIdentity] = useState<Maybe<Identity>>(null)

  useEffect(() => {
    setPollId(pollIdProp)
  }, [pollIdProp])

  // TODO Receive some state values of the poll

  const makeProof = useCallback(
    async (vote: bigint) => {
      if (!identity) throw Error('no identity')
      // group, externalNullifier
      const externalNullifier = pollId
      const proof = await generateProof(identity, mkTreeRoot, externalNullifier, vote)

      return proof
    },
    [identity, mkTreeRoot, pollId],
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
        args: [BigInt(pollId), BigInt(commitment), uid],
      })
        .then((hash) => {
          console.log({ voterAddedHash: hash })
        })
        .catch((e) => {
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
      const proof = await makeProof(BigInt(vote))
      await writeContractAsync({
        ...anonVoting,
        functionName: 'castVote',
        args: [proof.signal, proof.nullifierHash, proof.externalNullifier, proof.proof],
      })
        .then((hash) => {
          console.log({ voterAddedHash: hash })
        })
        .catch((e) => {
          console.error(e)
        })
    },
    [makeProof, writeContractAsync],
  )

  return { identity, createIdentity, createPoll, addVoter, startPoll, endPoll, castVote }
}
