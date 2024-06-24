import type { NextPage } from 'next'
import styled from 'styled-components'

import { Button } from '@/src/components/buttons/Button'
import { BaseCard } from '@/src/components/common/BaseCard'
import { BaseParagraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { Code } from '@/src/components/text/Code'
import { useIdentity } from '@/src/hooks/useIdentity'
import { useUidEAS } from '@/src/hooks/useUidEAS'
import { useWeb3ConnectedApp, useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Card = styled(BaseCard)`
  min-height: 300px;
`

const Address: React.FC = () => {
  const { address } = useWeb3ConnectedApp()

  return address ? <Code>{address}</Code> : null
}

const Home: NextPage = () => {
  const { address, isAppConnected } = useWeb3Connection()
  const { addVoter, createIdentity, createPoll, identity, startPoll } = useIdentity()

  // TOD Move schemaId to envVar
  const { data } = useUidEAS({
    recipient: address ?? '',
    schemaId: '0xfdcfdad2dbe7489e0ce56b260348b7f14e8365a8a325aef9834818c00d46b31b',
  })

  console.log(data)

  return (
    <>
      <BaseTitle>Welcome to Anon Voting!</BaseTitle>
      <Card>
        {isAppConnected && (
          <BaseParagraph>
            Your wallet address: <Address />
            {identity && <p>Your identity is: {identity.getCommitment().toString()}</p>}
            <Button onClick={() => createIdentity()}>Generate identity</Button>
            <Button onClick={() => createPoll()}>Create Poll</Button>
            <Button onClick={() => startPoll()}>Start Poll</Button>
            <Button onClick={() => addVoter('', '')}>Add Voter</Button>
          </BaseParagraph>
        )}
      </Card>
    </>
  )
}

export default Home
