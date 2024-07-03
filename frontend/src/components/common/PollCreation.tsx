import { Dispatch, SetStateAction, useState } from 'react'

import { Address } from 'viem'
import { useAccount } from 'wagmi'

import { ActionsWrapper } from './Poll'
import { Button } from '../buttons/Button'
import { DataInput } from '../form/DataInput'

import { MT_DEPTH } from '@/src/constants/common'
import { useWriteAnonVotingCreatePoll } from '@/src/hooks/generated/hooks'

type PollCreationProps = { pollId: Maybe<bigint>; onSuccess: () => void }
export const PollCreation = ({ onSuccess, pollId }: PollCreationProps) => {
  const { address } = useAccount()
  const [coordinator, setCoordinator] = useState<Address | undefined>(address)
  const {
    isError: isErrorCreatePoll,
    isPending: isPendingCreatePoll,
    isSuccess: isSuccessCreatePoll,
    writeContractAsync: createPoll,
  } = useWriteAnonVotingCreatePoll()

  return (
    <>
      <DataInput
        description="Fill in the coordinator field with an address to create a poll. After the poll is created, the coordinator must set the valid schema and attester."
        id="coordinator"
        initialValue={address ?? ''}
        label="Coordinator"
        onChange={setCoordinator as Dispatch<SetStateAction<string>>}
        value={coordinator ?? ''}
      />

      <ActionsWrapper>
        <Button
          disabled={coordinator === undefined || coordinator.length === 0 || pollId === null}
          onClick={() =>
            createPoll({
              args: [pollId, coordinator!, BigInt(MT_DEPTH)],
            }).then(onSuccess)
          }
        >
          Create Poll
        </Button>
        {isErrorCreatePoll && 'error creating poll'}
        {isPendingCreatePoll && 'is pending creating poll'}
        {isSuccessCreatePoll && ' success '}
      </ActionsWrapper>
    </>
  )
}
