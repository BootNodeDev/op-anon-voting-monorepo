import type { NextPage } from 'next'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { Address as ViemAddress } from 'viem'

import { Button } from '@/src/components/buttons/Button'
import { BaseCard } from '@/src/components/common/BaseCard'
import { BaseParagraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { Code } from '@/src/components/text/Code'
import { useIdentity } from '@/src/hooks/useIdentity'
import { useUidEAS } from '@/src/hooks/useUidEAS'
import { useWeb3ConnectedApp, useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { Maybe } from '@/types/utils'

const Card = styled(BaseCard)`
  min-height: 300px;
`

const Address: React.FC = () => {
  const { address } = useWeb3ConnectedApp()

  return address ? <Code>{address}</Code> : null
}

type DataViewProps = { message: string; data: Maybe<string> }
const DataView = ({ data, message }: DataViewProps) => {
  return data ? (
    <BaseParagraph>
      {message}
      <Code>{data}</Code>
    </BaseParagraph>
  ) : null
}

const Input = styled.input``
const Label = styled.label``

type DataInputProps = {
  onChange: Dispatch<SetStateAction<string>>
  value: string
  id: string
  label: string
}
const DataInput = ({ id, label, onChange, value }: DataInputProps) => {
  const handleChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const newValue = event && event.target ? event.currentTarget.value : ''
      onChange(newValue)
    },
    [onChange],
  )

  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} onChange={handleChange} type="text" value={value} />
    </>
  )
}

const Home: NextPage = () => {
  const { address = '0x', isAppConnected } = useWeb3Connection()
  const [pollId, setPollId] = useState('1')
  const { addVoter, castVote, createIdentity, createPoll, endPoll, identity, startPoll } =
    useIdentity(BigInt(pollId))

  // TOD Move schemaId to envVar
  const { data: easSubgraphData } = useUidEAS({
    recipient: address,
    schemaId: '0xfdcfdad2dbe7489e0ce56b260348b7f14e8365a8a325aef9834818c00d46b31b',
  })

  const [uid, setUid] = useState<Maybe<ViemAddress>>(null)
  const [vote, setVote] = useState('1')
  const [coordinator, setCoordinator] = useState<ViemAddress>(address)

  useEffect(() => {
    const att = easSubgraphData?.attestations[0]
    console.log({ att })
    const newUid = att && att.id && att.recipient === address ? att.id : null

    setUid(newUid as ViemAddress)
  }, [address, easSubgraphData?.attestations])

  return (
    <>
      <BaseTitle>Welcome to Anon Voting!</BaseTitle>
      <Card>
        {isAppConnected && (
          <BaseParagraph>
            Your wallet address: <Address />
            <DataView
              data={identity && identity.getCommitment().toString()}
              message="Your identity is:"
            ></DataView>
            <Button onClick={() => createIdentity()}>1. Generate identity</Button>
            <DataView data={uid} message="Your attestation id is:"></DataView>
            <DataInput
              id="coordinator"
              label="Coordinator"
              onChange={setCoordinator as Dispatch<SetStateAction<string>>}
              value={coordinator}
            />
            <DataInput id="poll-id" label="Poll ID" onChange={setPollId} value={pollId} />
            <Button onClick={() => createPoll(coordinator)}>Create Poll</Button>
            <Button
              disabled={identity === null || uid === null}
              onClick={() => identity && uid && addVoter(identity.getCommitment().toString(), uid)}
            >
              Add Voter
            </Button>
            <Button onClick={() => startPoll()}>Start Poll</Button>
            <DataInput id="vote" label="Vote" onChange={setVote} value={vote} />
            <Button onClick={() => castVote(+vote)}>Cast Vote</Button>
            <Button onClick={() => endPoll()}>End Poll</Button>
          </BaseParagraph>
        )}
      </Card>
    </>
  )
}

export default Home
