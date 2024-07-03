import type { NextPage } from 'next'
import { useState } from 'react'

import { ButtonDropdown } from '@/src/components/buttons/ButtonDropdown'
import { AdminPoll } from '@/src/components/common/AdminPoll'
import { DropdownItem } from '@/src/components/common/Dropdown'
import {
  BigButton,
  Card,
  NotConnected,
  Row,
  Title,
  Wrapper,
  WrapperDropdown,
} from '@/src/components/common/Poll'
import { PollCreation } from '@/src/components/common/PollCreation'
import { PollEnrollment } from '@/src/components/common/PollEnrollment'
import { UserId } from '@/src/components/common/UserId'
import { Votes } from '@/src/components/common/Votes'
import { DataInput } from '@/src/components/form/DataInput'
import { Radiobutton } from '@/src/components/form/Radiobutton'
import { BigParagraph } from '@/src/components/text/BaseParagraph'
import { PageTitle } from '@/src/components/text/BaseTitle'
import { useReadAnonVotingGetPolls } from '@/src/hooks/generated/hooks'
import { useCurrentPoll, useCurrentPollProps } from '@/src/hooks/useCurrentPoll'
import { useUserAttestation } from '@/src/hooks/useEAS'
import { useIdentity } from '@/src/hooks/useIdentity'
import { usePollId } from '@/src/hooks/usePollId'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

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
  const { canAdmin, canEndPoll, canStartPoll, canVote, currentPoll, isEnrolled, result, votes } =
    useCurrentPoll({
      pollId,
      polls,
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
          <Wrapper>
            <Row>
              <Radiobutton
                checked={pollForm === 'CREATE_POLL'}
                onClick={() => {
                  setPollForm('CREATE_POLL')
                  handleChangePollId('')
                }}
              >
                Create Poll
              </Radiobutton>
              <Radiobutton
                checked={pollForm === 'USE_POLL'}
                disabled={!polls || polls.length === 0}
                onClick={() => setPollForm('USE_POLL')}
              >
                Use existing poll
              </Radiobutton>
            </Row>
            {pollForm === 'USE_POLL' ? (
              <>
                <PageTitle>Select an existing poll</PageTitle>
                <WrapperDropdown
                  dropdownButton={
                    <ButtonDropdown>
                      {currentPoll ? <p>{currentPoll.id.toString()}</p> : <p>select</p>}
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
                {currentPoll ? (
                  <>
                    <UserId
                      createIdentity={createIdentity}
                      loading={loadingAttestation || identityCreationState === 'pending'}
                      publicIdentity={publicIdentity}
                      uid={uid}
                    />
                    {canAdmin && pollId && (
                      <AdminPoll canEnd={canEndPoll} canStart={canStartPoll} pollId={pollId} />
                    )}
                    {uid && publicIdentity && (
                      <PollEnrollment
                        currentPoll={currentPoll}
                        isEnrolled={isEnrolled}
                        publicIdentity={publicIdentity}
                        uid={uid}
                      />
                    )}
                    {identity && (
                      <Votes
                        canVote={canVote}
                        currentPoll={currentPoll}
                        identity={identity}
                        result={result}
                        votes={votes}
                      />
                    )}
                  </>
                ) : (
                  <div>error fetching poll</div>
                )}
              </>
            ) : pollForm === 'CREATE_POLL' ? (
              <>
                <DataInput
                  description="Enter the ID of the poll you want to vote for or provide a unique ID to create a new one."
                  error={pollIdError}
                  id="poll-id"
                  initialValue="1"
                  label="Poll ID"
                  onChange={handleChangePollId}
                  value={pollId ? pollId.toString() : ''}
                />
                <PollCreation
                  onSuccess={() => getPolls().then(() => setPollForm('USE_POLL'))}
                  pollId={pollId}
                />
              </>
            ) : (
              <div>invalid form option</div>
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
