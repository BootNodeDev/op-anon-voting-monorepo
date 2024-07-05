import { Address } from 'viem'

import { AlertMessage } from './AlertMessage'
import { Button } from '../buttons/Button'
import { useWriteAnonVotingAddVoter } from '@/src/hooks/generated/hooks'
import { Poll } from '@/src/hooks/useCurrentPoll'
import { useWriteWithConfirmationsWagmiWrapper } from '@/src/hooks/useWriteWithConfirmationsWagmiWrapper'
import { PollState } from '@/types/polls'

type PollEnrollmentProps = {
  publicIdentity: bigint
  uid: string
  currentPoll: Poll
  isEnrolled: boolean
  onEnroll: () => void
}
export const PollEnrollment = ({
  currentPoll,
  isEnrolled,
  onEnroll,
  publicIdentity,
  uid,
}: PollEnrollmentProps) => {
  const {
    // isError,
    // isPending,
    // isSuccess,
    isError,
    isWaiting,
    writeContractAsync: addVoter,
  } = useWriteWithConfirmationsWagmiWrapper(useWriteAnonVotingAddVoter, onEnroll)

  return !isEnrolled ? (
    <>
      <Button
        disabled={
          isEnrolled ||
          publicIdentity === undefined ||
          uid === null ||
          currentPoll.state !== PollState.Created ||
          isWaiting
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
      {isError && (
        <AlertMessage isError={isError}>
          <>Error enrolling to vote.</>
        </AlertMessage>
      )}
    </>
  ) : (
    <p>User already enrolled</p>
  )
}
