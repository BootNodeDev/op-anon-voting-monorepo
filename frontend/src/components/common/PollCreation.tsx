import { Dispatch, SetStateAction, useState } from 'react'

import { Address } from 'viem'
import { useAccount } from 'wagmi'

import { ActionsWrapper, BigButton } from './Poll'
import { DataInput } from '../form/DataInput'
import { AlertMessage } from '@/src/components/common/AlertMessage'
import { MT_DEPTH } from '@/src/constants/common'
import { ZEROn } from '@/src/constants/numbers'
import { useWriteAnonVotingCreatePoll } from '@/src/hooks/generated/hooks'
import { Poll } from '@/src/hooks/useCurrentPoll'
import { useWriteWithConfirmationsWagmiWrapper } from '@/src/hooks/useWriteWithConfirmationsWagmiWrapper'
import { Maybe } from '@/types/utils'

type PollCreationProps = {
  pollId: Maybe<bigint>
  onSuccess: () => void
  currentPoll: Poll | undefined
}
export const PollCreation = ({ currentPoll, onSuccess, pollId }: PollCreationProps) => {
  const { address } = useAccount()
  const [coordinator, setCoordinator] = useState<Address | undefined>(address)
  const {
    isError,
    isSuccessMined,
    isWaiting,
    writeContractAsync: createPoll,
  } = useWriteWithConfirmationsWagmiWrapper(useWriteAnonVotingCreatePoll, onSuccess)

  return (
    <>
      <DataInput
        description="To create a poll, fill in the coordinator field with an address. Once the poll is created, the coordinator must set the valid schema and attester."
        error={isError ? 'Error creating poll' : null}
        id="coordinator"
        initialValue={address ?? ''}
        label="Coordinator"
        onChange={setCoordinator as Dispatch<SetStateAction<string>>}
        value={coordinator ?? ''}
      />
      {isError && (
        <AlertMessage isError={isError}>
          <>Error creating the poll.</>
        </AlertMessage>
      )}
      {isSuccessMined && (
        <AlertMessage>
          <>The poll was created successfully.</>
        </AlertMessage>
      )}
      <ActionsWrapper>
        <BigButton
          disabled={
            coordinator === undefined ||
            coordinator.length === 0 ||
            pollId === null ||
            pollId === ZEROn ||
            isWaiting ||
            !!currentPoll
          }
          onClick={
            () =>
              createPoll({
                args: [pollId as bigint, coordinator!, BigInt(MT_DEPTH)],
              }).catch(() => {})
            // .finally(reset)
          }
        >
          {isWaiting ? 'Poll is being created.' : 'Create Poll'}
        </BigButton>
      </ActionsWrapper>
    </>
  )
}
