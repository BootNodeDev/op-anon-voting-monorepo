import { useCallback } from 'react'

import { Group } from '@semaphore-protocol/group'
import { Identity } from '@semaphore-protocol/identity'
import { generateProof } from '@semaphore-protocol/proof'
import { useQuery } from '@tanstack/react-query'

import { MT_DEPTH } from '../constants/common'
import { PollVote } from '@/types/polls'

type useCastVoteProps = { identity: Identity; vote: PollVote; voters: bigint[]; pollId: bigint }

export const useCastVote = ({ identity, pollId, vote, voters }: useCastVoteProps) => {
  const makeProof = useCallback(
    async (vote: bigint) => {
      const externalNullifier = pollId
      const group = new Group(pollId, MT_DEPTH, voters)

      const proof = await generateProof(identity, group, externalNullifier, vote)
      return proof
    },
    [identity, pollId, voters],
  )
  const castVote = useCallback(async () => {
    const semaphoreProof = await makeProof(BigInt(vote))
    await fetch('/api/castVote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vote, semaphoreProof }),
    })
  }, [makeProof, vote])

  return useQuery({
    queryKey: ['castVote'],
    queryFn: async () => await castVote(),
    enabled: false,
  })
}
