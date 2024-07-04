import { useState } from 'react'

import { Identity } from '@semaphore-protocol/identity'

import { BigButton, RadioButtonsWrapper, VoteWrapper } from './Poll'
import { Radiobutton } from '../form/Radiobutton'
import { BaseParagraph } from '@/src/components/text/BaseParagraph'
import { PageTitle } from '@/src/components/text/BaseTitle'
import { useCastVote } from '@/src/hooks/useCastVote'
import { Poll, useCurrentPoll } from '@/src/hooks/useCurrentPoll'
import { PollState, PollVote } from '@/types/polls'

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
        <div>
          <PageTitle>
            {currentPoll.state === PollState.Ended && 'Poll has ended'}
            {currentPoll.state === PollState.Ongoing && 'Poll is open'}
          </PageTitle>
          <BaseParagraph>{result}</BaseParagraph>{' '}
        </div>
        <RadioButtonsWrapper>
          <Radiobutton
            checked={vote === PollVote.Yes}
            ended={currentPoll.state === PollState.Ended}
            onClick={() => setVote(PollVote.Yes)}
          >
            {`Yes (${votes[PollVote.Yes]})`}
          </Radiobutton>
          <Radiobutton
            checked={vote === PollVote.No}
            ended={currentPoll.state === PollState.Ended}
            onClick={() => setVote(PollVote.No)}
          >
            {`No (${votes[PollVote.No]})`}
          </Radiobutton>
        </RadioButtonsWrapper>

        <BigButton disabled={!canVote || isLoading} onClick={() => castVote}>
          Cast Vote
        </BigButton>
        {isError && <p>Error voting</p>}
      </VoteWrapper>
    </>
  )
}
