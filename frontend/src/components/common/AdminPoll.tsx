import { useState } from 'react'

import { Address } from 'viem'

import { ActionsWrapper } from './Poll'
import { Button } from '../buttons/Button'
import { DataInput } from '../form/DataInput'

import { PASSWORD } from '@/src/constants/common'
import {
  useWriteAnonVotingEndPoll,
  useWriteAnonVotingSetTrustedAttester,
  useWriteAnonVotingSetValidSchema,
  useWriteAnonVotingStartPoll,
} from '@/src/hooks/generated/hooks'

type AdminPollProps = {
  pollId: bigint
  canEnd: boolean
  canStart: boolean
}
export const AdminPoll = ({ canEnd, canStart, pollId }: AdminPollProps) => {
  const { writeContractAsync: setTrustedAttester } = useWriteAnonVotingSetTrustedAttester()
  const { writeContractAsync: setValidSchema } = useWriteAnonVotingSetValidSchema()
  const {
    //isError: isErrorStartPoll,
    isPending: isPendingStartPoll,
    //isSuccess: isSuccessStartPoll,
    writeContractAsync: startPoll,
  } = useWriteAnonVotingStartPoll()
  const {
    //isError: isErrorEndPoll,
    isPending: isPendingEndPoll,
    //isSuccess: isSuccessEndPoll,
    writeContractAsync: endPoll,
  } = useWriteAnonVotingEndPoll()

  const [schema, setSchema] = useState(process.env.NEXT_PUBLIC_EAS_SCHEMA ?? '')
  const [attester, setAttester] = useState(process.env.NEXT_PUBLIC_EAS_ATTESTER ?? '')

  return (
    <ActionsWrapper>
      <DataInput
        description="Fill in the EAS schema address."
        id="schema"
        label="Schema"
        onChange={setSchema}
        value={schema}
      />
      <DataInput
        description="Fill in the EAS attester address."
        id="attester"
        label="Attester"
        onChange={setAttester}
        value={attester}
      />
      <Button
        disabled={attester.length !== 42}
        onClick={() => setTrustedAttester({ args: [pollId, attester as Address, true] })}
      >
        Set Attester
      </Button>
      <Button
        disabled={schema.length !== 66}
        onClick={() => setValidSchema({ args: [pollId, schema as Address, true] })}
      >
        Set Schema
      </Button>
      <Button
        disabled={!canStart || isPendingStartPoll}
        onClick={() => startPoll({ args: [pollId, BigInt(PASSWORD)] })}
      >
        Start Poll
      </Button>
      <Button
        disabled={!canEnd || isPendingEndPoll}
        onClick={() => endPoll({ args: [pollId, BigInt(PASSWORD)] })}
      >
        End Poll
      </Button>
    </ActionsWrapper>
  )
}
