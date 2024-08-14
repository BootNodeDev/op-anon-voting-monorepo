import styled from 'styled-components'

import { ActionsWrapper, BigButton, ColumnFullHeight } from './Poll'

import { PASSWORD } from '@/src/constants/common'
import { useWriteAnonVotingEndPoll, useWriteAnonVotingStartPoll } from '@/src/hooks/generated/hooks'
import { useWriteWithConfirmationsWagmiWrapper } from '@/src/hooks/useWriteWithConfirmationsWagmiWrapper'

const Actions = styled(ActionsWrapper)`
  align-items: stretch;
`

type AdminPollProps = {
  pollId: bigint
  canEnd: boolean
  canStart: boolean
  onStart: () => void
  onEnd: () => void
}
export const AdminPoll = ({ canEnd, canStart, onEnd, onStart, pollId }: AdminPollProps) => {
  const {
    //isError: isErrorStartPoll,
    isWaiting: isPendingStartPoll,
    //isSuccess: isSuccessStartPoll,
    writeContractAsync: startPoll,
  } = useWriteWithConfirmationsWagmiWrapper(useWriteAnonVotingStartPoll, onStart)
  const {
    //isError: isErrorEndPoll,
    isWaiting: isPendingEndPoll,
    //isSuccess: isSuccessEndPoll,
    writeContractAsync: endPoll,
  } = useWriteWithConfirmationsWagmiWrapper(useWriteAnonVotingEndPoll, onEnd)

  return (
    <Actions>
      <ColumnFullHeight>
        <BigButton
          disabled={!canStart || isPendingStartPoll}
          onClick={() => startPoll({ args: [pollId, BigInt(PASSWORD)] })}
        >
          Start Poll
        </BigButton>
        <BigButton
          disabled={!canEnd || isPendingEndPoll}
          onClick={() => endPoll({ args: [pollId, BigInt(PASSWORD)] })}
        >
          End Poll
        </BigButton>
      </ColumnFullHeight>
    </Actions>
  )
}
