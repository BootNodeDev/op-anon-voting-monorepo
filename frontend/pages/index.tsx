import type { NextPage } from 'next'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import styled from 'styled-components'

import { Address } from 'viem'
import { useAccount } from 'wagmi'

import { Button } from '@/src/components/buttons/Button'
import { BaseCard } from '@/src/components/common/BaseCard'
import { Identity } from '@/src/components/common/Identity'
import { Formfield } from '@/src/components/form/Formfield'
import { Radiobutton } from '@/src/components/form/Radiobutton'
import { Textfield } from '@/src/components/form/Textfield'
import { BigParagraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import {
  useReadAnonVotingGetPolls,
  useWriteAnonVotingCreatePoll,
  useWriteAnonVotingSetTrustedAttester,
  useWriteAnonVotingSetValidSchema,
} from '@/src/hooks/generated/hooks'
import { useUserAttestation } from '@/src/hooks/useEAS'
import { MT_DEPTH, useIdentity } from '@/src/hooks/useIdentity'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

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

enum PollState {
  Created,
  Ongoing,
  Ended,
}

const Home: NextPage = () => {
  const { connectWallet, isAppConnected } = useWeb3Connection()
  const { address } = useAccount()
  const [pollId, setPollId] = useState('1')
  const { addVoter, castVote, createIdentity, endPoll, identity, startPoll } = useIdentity(
    BigInt(pollId),
  )

  const [vote, setVote] = useState('1')
  const [schema, setSchema] = useState(process.env.NEXT_PUBLIC_EAS_SCHEMA ?? '')
  const [attester, setAttester] = useState(process.env.NEXT_PUBLIC_EAS_ATTESTER ?? '')
  const [coordinator, setCoordinator] = useState<Address | undefined>(address)
  const { writeContractAsync: createPoll } = useWriteAnonVotingCreatePoll()
  const { data: polls } = useReadAnonVotingGetPolls()
  const { writeContractAsync: setTrustedAttester } = useWriteAnonVotingSetTrustedAttester()
  const { writeContractAsync: setValidSchema } = useWriteAnonVotingSetValidSchema()

  console.log(polls)
  const { error, isAttested, loading, uid } = useUserAttestation()

  console.log({ isAttested, error, loading })

  // TODO move to hook
  const currentPollIndex = polls?.findIndex((e) => e.id === BigInt(pollId))
  const pollExists = currentPollIndex !== -1
  const currentPoll = pollExists && polls && currentPollIndex ? polls[currentPollIndex] : null
  const voterEnrolled =
    identity &&
    currentPoll &&
    currentPoll.voters.includes(BigInt(identity.getCommitment().toString()))

  console.log(currentPoll)
  return (
    <>
      <Title>
        Revolutionary anonymous voting system. <br />
        Preserves users’ identity privacy.
      </Title>
      <Card>
        {isAppConnected ? (
          <Wrapper>
            <DataInput
              description="Enter the ID of the poll you want to vote for or provide a unique ID to create a new one."
              id="poll-id"
              label="Poll ID"
              onChange={setPollId}
              value={pollId}
            />
            {currentPoll ? (
              <>
                <BigParagraph>Poll already exists</BigParagraph>
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

                {currentPoll.coordinator === address && (
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
                      onClick={() =>
                        setTrustedAttester({ args: [BigInt(pollId), attester as Address, true] })
                      }
                    >
                      Set Attester
                    </Button>
                    <Button
                      disabled={schema.length !== 66}
                      onClick={() =>
                        setValidSchema({ args: [BigInt(pollId), schema as Address, true] })
                      }
                    >
                      Set Schema
                    </Button>
                    <Button
                      disabled={currentPoll.state !== PollState.Created}
                      onClick={() => startPoll()}
                    >
                      Start Poll
                    </Button>
                    <Button
                      disabled={currentPoll.state !== PollState.Ongoing}
                      onClick={() => endPoll()}
                    >
                      End Poll
                    </Button>
                  </ActionsWrapper>
                )}

                {!voterEnrolled ? (
                  <Button
                    disabled={
                      identity === null || uid === null || currentPoll.state !== PollState.Created
                    }
                    onClick={() =>
                      identity && uid && addVoter(identity.getCommitment().toString(), uid)
                    }
                    variant="primaryInverted"
                  >
                    Enroll to vote
                  </Button>
                ) : (
                  <VoteWrapper>
                    <RadioButtonsWrapper>
                      <Radiobutton checked={vote === '1'} onClick={() => setVote('1')}>
                        {`Yes ${currentPoll.votes.reduce((acc, curr) => {
                          acc += curr.toString() == '1' ? BigInt(1) : BigInt(0)
                          console.log(curr.toString(), acc)

                          return acc
                        }, BigInt(0))}`}
                      </Radiobutton>
                      <Radiobutton checked={vote === '0'} onClick={() => setVote('0')}>
                        {`No ${currentPoll.votes.reduce((acc, curr) => {
                          acc += curr.toString() == '0' ? BigInt(1) : BigInt(0)
                          console.log(curr.toString(), acc)

                          return acc
                        }, BigInt(0))}`}
                      </Radiobutton>
                    </RadioButtonsWrapper>
                    {/* TODO: This button should be disabled if no option was selected, the poll was not initiated  */}
                    <BigButton
                      disabled={currentPoll.state !== PollState.Ongoing}
                      onClick={() => castVote(+vote, currentPoll.voters as bigint[])}
                    >
                      Cast Vote
                    </BigButton>
                  </VoteWrapper>
                )}
              </>
            ) : (
              <>
                <DataInput
                  description="Fill in the coordinator field with an address to create a poll. After the poll is created, the coordinator must set the valid schema and attester."
                  id="coordinator"
                  label="Coordinator"
                  onChange={setCoordinator as Dispatch<SetStateAction<string>>}
                  value={coordinator ?? ''}
                />

                <ActionsWrapper>
                  <Button
                    disabled={coordinator === undefined || coordinator.length === 0}
                    onClick={() =>
                      createPoll({
                        args: [BigInt(pollId), coordinator!, BigInt(MT_DEPTH)],
                      })
                    }
                  >
                    Create Poll
                  </Button>
                </ActionsWrapper>
              </>
            )}
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
