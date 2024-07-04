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

type VotingResult = string

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
    }
    return undefined
  }, [pollId, polls])

  const isEnrolled =
    !!currentPoll && !!publicIdentity && currentPoll.voters.includes(publicIdentity)

  const canVote = !!currentPoll && !!isEnrolled && currentPoll.state === PollState.Ongoing
  const canAdmin = !!currentPoll && !!address && currentPoll.coordinator === address

  const canStartPoll = !!currentPoll && !!canAdmin && currentPoll.state === PollState.Created
  const canEndPoll = !!currentPoll && !!canAdmin && currentPoll.state === PollState.Ongoing

  const canSetSchema = !!currentPoll && !!canAdmin && currentPoll.state === PollState.Created
  const canSetAttester = !!currentPoll && !!canAdmin && currentPoll.state === PollState.Created

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
      ? 'Winner is yes'
      : votes[PollVote.Yes] < votes[PollVote.No]
      ? 'Winner is No'
      : 'The result is a tie'
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
