import type { NextPage } from 'next'

import { AdminPoll } from '@/src/components/common/AdminPoll'
import { BigButton, Card, NotConnected, Title, Wrapper } from '@/src/components/common/Poll'
import { PollCreation } from '@/src/components/common/PollCreation'
import { PollEnrollment } from '@/src/components/common/PollEnrollment'
import { UserId } from '@/src/components/common/UserId'
import { Votes } from '@/src/components/common/Votes'
import { DataInput } from '@/src/components/form/DataInput'
import { BigParagraph } from '@/src/components/text/BaseParagraph'
import { useReadAnonVotingGetPolls } from '@/src/hooks/generated/hooks'
import { useCurrentPoll, useCurrentPollProps } from '@/src/hooks/useCurrentPoll'
import { useUserAttestation } from '@/src/hooks/useEAS'
import { useIdentity } from '@/src/hooks/useIdentity'
import { usePollId } from '@/src/hooks/usePollId'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Home: NextPage = () => {
  const { connectWallet, isAppConnected } = useWeb3Connection()
  const { error: pollIdError, handleChangePollId, pollId } = usePollId()
  const { createIdentity, identity, publicIdentity, state: identityCreationState } = useIdentity()

  const {
    data: polls,
    //error: errorGettingPolls,
    // isLoading: isLoadingGettingPolls,
    refetch: getPolls,
  } = useReadAnonVotingGetPolls()
  const { canAdmin, canEndPoll, canStartPoll, canVote, currentPoll, isEnrolled, result, votes } =
    useCurrentPoll({
      polls,
    } as useCurrentPollProps)

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
            <DataInput
              description="Enter the ID of the poll you want to vote for or provide a unique ID to create a new one."
              error={pollIdError}
              id="poll-id"
              label="Poll ID"
              onChange={handleChangePollId}
              value={pollId ? pollId.toString() : ''}
            />
            {currentPoll ? (
              <>
                <BigParagraph>Poll already exists</BigParagraph>
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
            ) : pollId ? (
              <PollCreation onSuccess={getPolls} pollId={pollId} />
            ) : null}
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
