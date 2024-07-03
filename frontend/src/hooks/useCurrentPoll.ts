import { useMemo } from 'react'

import { useAccount } from 'wagmi'

import { PollState, PollVote } from '@/types/polls'

export type Poll = {
  id: bigint
  coordinator: `0x${string}`
  state: PollState
  votes: bigint[]
  voters: bigint[]
}

type VotingResult = 'Tie' | PollVote.Yes | PollVote.No

export type useCurrentPollProps = {
  polls: Poll[] | undefined
  publicIdentity: bigint | undefined
  pollId: bigint | null
}
export const useCurrentPoll = ({ pollId, polls, publicIdentity }: useCurrentPollProps) => {
  const { address } = useAccount()

  const currentPoll = useMemo(() => {
    if (polls && pollId) {
      return polls.find((e) => e.id === pollId)
    } else {
      return undefined
    }
  }, [pollId, polls])

  const isEnrolled = useMemo(() => {
    return !!currentPoll && !!publicIdentity && currentPoll.voters.includes(publicIdentity)
  }, [currentPoll, publicIdentity])

  const canVote = useMemo(() => {
    return !!currentPoll && !!isEnrolled && currentPoll.state === PollState.Ongoing
  }, [currentPoll, isEnrolled])

  const canAdmin = useMemo(() => {
    return !!currentPoll && !!address && currentPoll.coordinator === address
  }, [address, currentPoll])

  const canStartPoll = useMemo(() => {
    return !!currentPoll && !!canAdmin && currentPoll.state === PollState.Created
  }, [canAdmin, currentPoll])

  const canEndPoll = useMemo(() => {
    return !!currentPoll && !!canAdmin && currentPoll.state === PollState.Ongoing
  }, [canAdmin, currentPoll])

  const canSetSchema = useMemo(() => {
    return !!currentPoll && !!canAdmin && currentPoll.state === PollState.Created
  }, [canAdmin, currentPoll])

  const canSetAttester = useMemo(() => {
    return !!currentPoll && !!canAdmin && currentPoll.state === PollState.Created
  }, [canAdmin, currentPoll])

  const votes = useMemo(() => {
    const count: Record<PollVote, number> = {
      [PollVote.Yes]: 0,
      [PollVote.No]: 0,
      [PollVote.Void]: 0,
    }
    currentPoll &&
      currentPoll.votes.forEach((v) => {
        const vote = +v.toString()
        vote === PollVote.Yes
          ? count[PollVote.Yes]++
          : vote === PollVote.No
          ? count[PollVote.No]++
          : count[PollVote.Void]++
      })

    return count
  }, [currentPoll])

  const result: VotingResult = useMemo(() => {
    return votes[PollVote.Yes] > votes[PollVote.No]
      ? PollVote.Yes
      : votes[PollVote.Yes] < votes[PollVote.No]
      ? PollVote.No
      : 'Tie'
  }, [votes])

  return {
    currentPoll,
    isEnrolled,
    canVote,
    canStartPoll,
    canEndPoll,
    canSetAttester,
    canSetSchema,
    canAdmin,
    result,
    votes,
  }
}
