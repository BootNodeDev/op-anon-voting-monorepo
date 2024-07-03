import { useState } from 'react'

import { Identity } from '@semaphore-protocol/identity'

import { BigButton, RadioButtonsWrapper, VoteWrapper } from './Poll'
import { Radiobutton } from '../form/Radiobutton'

import { useCastVote } from '@/src/hooks/useCastVote'
import { Poll, useCurrentPoll } from '@/src/hooks/useCurrentPoll'
import { PollVote } from '@/types/polls'

type VotesProps = Pick<ReturnType<typeof useCurrentPoll>, 'result' | 'votes' | 'canVote'> & {
  currentPoll: Poll
} & { identity: Identity }
export const Votes = ({ canVote, currentPoll, identity, result, votes }: VotesProps) => {
  const [vote, setVote] = useState<PollVote>(PollVote.Yes)
  const {
    isError,
    isLoading,
    refetch: castVote,
  } = useCastVote({
    identity,
    pollId: currentPoll.id,
    vote,
    voters: currentPoll.voters,
  })

  return (
    <>
      <VoteWrapper>
        <RadioButtonsWrapper>
          <Radiobutton checked={vote === PollVote.Yes} onClick={() => setVote(PollVote.Yes)}>
            {`Yes ${votes[PollVote.Yes]}`}
          </Radiobutton>
          <Radiobutton checked={vote === PollVote.No} onClick={() => setVote(PollVote.No)}>
            {`No ${votes[PollVote.No]}`}
          </Radiobutton>
          <p>Winner is {result}</p>
        </RadioButtonsWrapper>
        <BigButton disabled={!canVote || isLoading} onClick={() => castVote}>
          Cast Vote
        </BigButton>
        {isError && <p>Error voting</p>}
      </VoteWrapper>
    </>
  )
}
