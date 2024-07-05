import { useState } from 'react'
import styled from 'styled-components'

import { Address } from 'viem'

import { ActionsWrapper, BigButton, Column, ColumnFullHeight } from './Poll'
import { Button } from '../buttons/Button'
import { DataInput } from '../form/DataInput'
import { PASSWORD } from '@/src/constants/common'
import {
  useWriteAnonVotingEndPoll,
  useWriteAnonVotingSetTrustedAttester,
  useWriteAnonVotingSetValidSchema,
  useWriteAnonVotingStartPoll,
} from '@/src/hooks/generated/hooks'
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
  const { writeContractAsync: setTrustedAttester } = useWriteAnonVotingSetTrustedAttester()
  const { writeContractAsync: setValidSchema } = useWriteAnonVotingSetValidSchema()
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

  const [schema, setSchema] = useState(process.env.NEXT_PUBLIC_EAS_SCHEMA ?? '')
  const [attester, setAttester] = useState(process.env.NEXT_PUBLIC_EAS_ATTESTER ?? '')

  return (
    <Actions>
      <Column>
        <DataInput
          id="schema"
          initialValue=""
          label="Schema"
          onChange={setSchema}
          placeholder="EAS schema address"
          value={schema}
        />
        <Button
          disabled={schema.length !== 66}
          onClick={() => setValidSchema({ args: [pollId, schema as Address, true] })}
        >
          Set Schema
        </Button>
      </Column>
      <Column>
        <DataInput
          id="attester"
          initialValue=""
          label="Attester"
          onChange={setAttester}
          placeholder="EAS attester address."
          value={attester}
        />
        <Button
          disabled={attester.length !== 42}
          onClick={() => setTrustedAttester({ args: [pollId, attester as Address, true] })}
        >
          Set Attester
        </Button>
      </Column>
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
