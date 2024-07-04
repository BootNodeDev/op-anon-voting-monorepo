import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { Address } from 'viem'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'

import { ActionsWrapper, BigButton } from './Poll'
import { DataInput } from '../form/DataInput'
import { MT_DEPTH } from '@/src/constants/common'
import { ZEROn } from '@/src/constants/numbers'
import { useWriteAnonVotingCreatePoll } from '@/src/hooks/generated/hooks'
import { Maybe } from '@/types/utils'

type PollCreationProps = { pollId: Maybe<bigint>; onSuccess: () => void }
export const PollCreation = ({ onSuccess, pollId }: PollCreationProps) => {
  const { address } = useAccount()
  const [coordinator, setCoordinator] = useState<Address | undefined>(address)
  const {
    data: hash,
    error: createPollError,
    isError: isErrorCreatePoll,
    isPending: isPendingCreatePoll,
    isSuccess: isSuccessCreatePoll,
    // reset,
    status,
    writeContractAsync: createPoll,
  } = useWriteAnonVotingCreatePoll()

  console.log(hash)
  const { isSuccess, status: status2 } = useWaitForTransactionReceipt({ hash, confirmations: 1 })

  useEffect(() => {
    if (isSuccess) {
      onSuccess()
    }
  }, [isSuccess, onSuccess])

  console.log({ status, status2, createPollError })
  return (
    <>
      <DataInput
        description="Fill in the coordinator field with an address to create a poll. After the poll is created, the coordinator must set the valid schema and attester."
        error={isErrorCreatePoll ? 'Error creating poll' : null}
        id="coordinator"
        initialValue={address ?? ''}
        label="Coordinator"
        onChange={setCoordinator as Dispatch<SetStateAction<string>>}
        value={coordinator ?? ''}
      />

      <ActionsWrapper>
        <BigButton
          disabled={
            coordinator === undefined ||
            coordinator.length === 0 ||
            pollId === null ||
            pollId === ZEROn ||
            isPendingCreatePoll
          }
          onClick={
            () =>
              createPoll({
                args: [pollId as bigint, coordinator!, BigInt(MT_DEPTH)],
              }).catch(() => {})
            // .finally(reset)
          }
        >
          Create Poll
        </BigButton>
        {isErrorCreatePoll && 'error creating poll'}
        {isPendingCreatePoll && 'is pending creating poll'}
        {isSuccessCreatePoll && ' success '}
      </ActionsWrapper>
    </>
  )
}
