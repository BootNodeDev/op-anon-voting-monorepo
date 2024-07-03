import { Address } from 'viem'

import { Button } from '../buttons/Button'

import { useWriteAnonVotingAddVoter } from '@/src/hooks/generated/hooks'
import { Poll } from '@/src/hooks/useCurrentPoll'
import { PollState } from '@/types/polls'

type PollEnrollmentProps = {
  publicIdentity: bigint
  uid: string
  currentPoll: Poll
  isEnrolled: boolean
}
export const PollEnrollment = ({
  currentPoll,
  isEnrolled,
  publicIdentity,
  uid,
}: PollEnrollmentProps) => {
  const {
    // isError,
    // isPending,
    // isSuccess,
    writeContractAsync: addVoter,
  } = useWriteAnonVotingAddVoter()

  return !isEnrolled ? (
    <Button
      disabled={
        isEnrolled ||
        publicIdentity === undefined ||
        uid === null ||
        currentPoll.state !== PollState.Created // TODO add something like is open to enroll
      }
      onClick={() =>
        publicIdentity &&
        uid &&
        addVoter({ args: [currentPoll.id, publicIdentity, uid as Address] })
      }
      variant="primaryInverted"
    >
      Enroll to vote
    </Button>
  ) : (
    <p>User already enrolled</p>
  )
}
