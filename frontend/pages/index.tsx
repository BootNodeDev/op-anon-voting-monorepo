import type { NextPage } from 'next'
import { useState } from 'react'

import { useWatchBlocks } from 'wagmi'

import { ButtonDropdown } from '@/src/components/buttons/ButtonDropdown'
import { AdminPoll } from '@/src/components/common/AdminPoll'
import { AlertMessage } from '@/src/components/common/AlertMessage'
import { DropdownItem } from '@/src/components/common/Dropdown'
import {
  BigButton,
  Card,
  NotConnected,
  Title,
  Wrapper,
  WrapperDropdown,
} from '@/src/components/common/Poll'
import { PollCreation } from '@/src/components/common/PollCreation'
import { PollEnrollment } from '@/src/components/common/PollEnrollment'
import { Tab, TabsWrapper } from '@/src/components/common/Tab'
import { UserId } from '@/src/components/common/UserId'
import { Votes } from '@/src/components/common/Votes'
import { DataInput } from '@/src/components/form/DataInput'
import { SidebarLayout } from '@/src/components/layout/SidebarLayout'
import { BigParagraph } from '@/src/components/text/BaseParagraph'
import { PageTitle } from '@/src/components/text/BaseTitle'
import { useReadAnonVotingGetPolls } from '@/src/hooks/generated/hooks'
import { useCurrentPoll, useCurrentPollProps } from '@/src/hooks/useCurrentPoll'
import { useUserAttestation } from '@/src/hooks/useEAS'
import { useIdentity } from '@/src/hooks/useIdentity'
import { usePollId } from '@/src/hooks/usePollId'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { PollState } from '@/types/polls'

type PollForm = 'CREATE_POLL' | 'USE_POLL'

const Home: NextPage = () => {
  const { connectWallet, isAppConnected } = useWeb3Connection()
  const { error: pollIdError, handleChangePollId, pollId } = usePollId()
  const { createIdentity, identity, publicIdentity, state: identityCreationState } = useIdentity()
  const [pollForm, setPollForm] = useState<PollForm>('CREATE_POLL')

  const {
    data: polls,
    //error: errorGettingPolls,
    // isLoading: isLoadingGettingPolls,
    refetch: getPolls,
  } = useReadAnonVotingGetPolls()

  useWatchBlocks({
    onBlock: () => {
      console.log('refetching polls')
      getPolls()
    },
  })

  const {
    canAdmin,
    canEndPoll,
    canEnroll,
    canStartPoll,
    canVote,
    currentPoll,
    isEnrolled,
    result,
    votes,
  } = useCurrentPoll({
    pollId,
    polls,
    publicIdentity,
  } as useCurrentPollProps)

  console.log(polls)
  console.log(currentPoll)
  const { loading: loadingAttestation, uid } = useUserAttestation()

  return (
    <>
      <Title>
        Revolutionary anonymous voting system. <br />
        Preserves users’ identity privacy.
      </Title>
      <Card>
        {isAppConnected ? (
          <SidebarLayout sidebarPlacement="right">
            <Wrapper>
              <TabsWrapper>
                <Tab
                  checked={pollForm === 'CREATE_POLL'}
                  onClick={() => {
                    setPollForm('CREATE_POLL')
                    handleChangePollId('')
                  }}
                >
                  Create poll
                </Tab>
                <Tab
                  checked={pollForm === 'USE_POLL'}
                  disabled={!polls || polls.length === 0}
                  onClick={() => setPollForm('USE_POLL')}
                >
                  Vote/manage poll
                </Tab>
              </TabsWrapper>

              {pollForm === 'USE_POLL' ? (
                <>
                  <PageTitle>Select an existing poll</PageTitle>
                  <WrapperDropdown
                    dropdownButton={
                      <ButtonDropdown>
                        {currentPoll ? <p>{currentPoll.id.toString()}</p> : <p>Select a poll</p>}
                      </ButtonDropdown>
                    }
                    items={
                      polls
                        ? polls.map((item, index) => {
                            return (
                              <DropdownItem
                                key={index}
                                onClick={() => {
                                  handleChangePollId(item.id.toString())
                                }}
                              >
                                {item.id.toString()}
                              </DropdownItem>
                            )
                          })
                        : []
                    }
                    onClick={console.log}
                  ></WrapperDropdown>
                  <UserId
                    createIdentity={createIdentity}
                    loading={loadingAttestation || identityCreationState === 'pending'}
                    publicIdentity={publicIdentity}
                    uid={uid}
                  />
                  {currentPoll ? (
                    <>
                      {canAdmin && pollId && (
                        <AdminPoll
                          canEnd={canEndPoll}
                          canStart={canStartPoll}
                          onEnd={getPolls}
                          onStart={getPolls}
                          pollId={pollId}
                        />
                      )}
                      {uid && publicIdentity && canEnroll && (
                        <PollEnrollment
                          currentPoll={currentPoll}
                          isEnrolled={isEnrolled}
                          onEnroll={getPolls}
                          publicIdentity={publicIdentity}
                          uid={uid}
                        />
                      )}
                      {identity && currentPoll.state !== PollState.Created && (
                        <Votes
                          canVote={canVote}
                          currentPoll={currentPoll}
                          identity={identity}
                          onVote={getPolls}
                          result={result}
                          votes={votes}
                        />
                      )}
                    </>
                  ) : (
                    <div>Please, select a poll</div>
                  )}
                </>
              ) : pollForm === 'CREATE_POLL' ? (
                <>
                  <DataInput
                    description="Enter the ID of the poll you wish to vote in, or provide a unique ID to create a new poll."
                    error={pollIdError}
                    id="poll-id"
                    initialValue="1"
                    label="Poll ID"
                    onChange={handleChangePollId}
                    value={pollId ? pollId.toString() : ''}
                  />
                  {currentPoll && (
                    <>
                      <AlertMessage isError>
                        <>
                          This poll already exists.{' '}
                          <button onClick={() => setPollForm('USE_POLL')}>
                            Vote or manage it.
                          </button>
                        </>
                      </AlertMessage>
                    </>
                  )}
                  <PollCreation
                    currentPoll={currentPoll}
                    onSuccess={() => getPolls().then(() => setPollForm('USE_POLL'))}
                    pollId={pollId}
                  />
                </>
              ) : (
                <div>invalid form option</div>
              )}
            </Wrapper>
          </SidebarLayout>
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
