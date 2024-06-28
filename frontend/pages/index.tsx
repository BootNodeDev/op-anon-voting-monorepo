import type { NextPage } from 'next'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { Address as ViemAddress } from 'viem'

import { Button } from '@/src/components/buttons/Button'
import { BaseCard } from '@/src/components/common/BaseCard'
import { Identity } from '@/src/components/common/Identity'
import { Formfield } from '@/src/components/form/Formfield'
import { Radiobutton } from '@/src/components/form/Radiobutton'
import { Textfield } from '@/src/components/form/Textfield'
import { BigParagraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { useIdentity } from '@/src/hooks/useIdentity'
import { useUidEAS } from '@/src/hooks/useUidEAS'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { Maybe } from '@/types/utils'

const Card = styled(BaseCard)`
  //min-height: 300px;
`
const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 950px;
`
const IdentityWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const Title = styled(BaseTitle)`
  margin: 24px 0;
  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    margin: 80px 0;
  }
`
const NotConnected = styled.div`
  padding: 32px 0px;
  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    padding: 48px 24px;
  }
`
const BigButton = styled(Button)`
  padding: 24px 36px;
`
const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`
const VoteWrapper = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`
const RadioButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
  width: 100%;
`

type DataInputProps = {
  onChange: Dispatch<SetStateAction<string>>
  value: string
  id: string
  label: string
  description?: string
}
const DataInput = ({ description, id, label, onChange, value }: DataInputProps) => {
  const handleChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const newValue = event && event.target ? event.currentTarget.value : ''
      onChange(newValue)
    },
    [onChange],
  )

  return (
    <>
      <Formfield
        description={description}
        formControl={<Textfield id={id} onChange={handleChange} placeholder="" value={value} />}
        label={label}
        labelFor={label}
      />
    </>
  )
}

const Home: NextPage = () => {
  const { address = '0x', connectWallet, isAppConnected } = useWeb3Connection()
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
      <Title>
        Revolutionary anonymous voting system. <br />
        Preserves users’ identity privacy.
      </Title>
      <Card>
        {isAppConnected ? (
          <Wrapper>
            <IdentityWrapper>
              <Identity
                identity={identity && identity.getCommitment().toString()}
                message="Your identity is:"
                onGenerate={() => createIdentity()}
              />
              {uid && (
                <Identity
                  identity={uid}
                  message="Your attestation id is:"
                  onGenerate={() => createIdentity()}
                />
              )}
            </IdentityWrapper>
            <DataInput
              description="Fill in the coordinator field with an address to create a poll, initiate the voting process, or conclude it."
              id="coordinator"
              label="Coordinator"
              onChange={setCoordinator as Dispatch<SetStateAction<string>>}
              value={coordinator}
            />
            <DataInput
              description="Enter the ID of the poll you want to vote for or provide a unique ID to create a new one."
              id="poll-id"
              label="Poll ID"
              onChange={setPollId}
              value={pollId}
            />
            <ActionsWrapper>
              {/* TODO: This button should be disabled if the ID is not available  */}
              <Button onClick={() => createPoll(coordinator)}>Create Poll</Button>
              {/* TODO: This button should be disabled if the poll wasn't created and you are not the creator  */}
              <Button onClick={() => startPoll()}>Start Poll</Button>
              {/* TODO: This button should be disabled if the poll wasn't created and wasn't initiated and you are not the creator */}
              <Button onClick={() => endPoll()}>End Poll</Button>

              <Button
                disabled={identity === null || uid === null}
                onClick={() =>
                  identity && uid && addVoter(identity.getCommitment().toString(), uid)
                }
                variant="primaryInverted"
              >
                Enroll to vote
              </Button>
            </ActionsWrapper>

            <VoteWrapper>
              <RadioButtonsWrapper>
                <Radiobutton checked={vote === '1'} onClick={() => setVote('1')}>
                  Yes
                </Radiobutton>
                <Radiobutton checked={vote === '0'} onClick={() => setVote('0')}>
                  No
                </Radiobutton>
              </RadioButtonsWrapper>
              {/* TODO: This button should be disabled if no option was selected, the poll was not initiated  */}
              <BigButton onClick={() => castVote(+vote)}>Cast Vote</BigButton>
            </VoteWrapper>
          </Wrapper>
        ) : (
          <NotConnected>
            <BigParagraph>
              Effortlessly connect your wallet, generate a secure anonymous identity, and dive into
              the power of decentralized decision-making by <strong>creating polls</strong> or{' '}
              <strong>casting your vote</strong>.
            </BigParagraph>
            <BigButton onClick={connectWallet} variant="primary">
              Connect wallet
            </BigButton>
          </NotConnected>
        )}
      </Card>
    </>
  )
}

export default Home
