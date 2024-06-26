import type { NextPage } from 'next'
import styled from 'styled-components'

import { Button } from '@/src/components/buttons/Button'
import { BaseCard } from '@/src/components/common/BaseCard'
import { BaseParagraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { Code } from '@/src/components/text/Code'
import { useIdentity } from '@/src/hooks/useIdentity'
import { useWeb3ConnectedApp, useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Card = styled(BaseCard)`
  min-height: 300px;
`
const Title = styled(BaseTitle)`
  margin: 24px 0;
  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    margin: 80px 0;
  }
`

const Address: React.FC = () => {
  const { address } = useWeb3ConnectedApp()

  return address ? <Code>{address}</Code> : null
}

const Home: NextPage = () => {
  const { isAppConnected } = useWeb3Connection()
  const { createIdentity } = useIdentity()

  return (
    <>
      <Title>
        Revolutionary anonymous voting system. <br />
        Preserves users’ identity privacy.
      </Title>
      <Card>
        {isAppConnected && (
          <BaseParagraph>
            Your wallet address: <Address />
            <Button onClick={() => createIdentity()}>Generate identity</Button>
          </BaseParagraph>
        )}
      </Card>
    </>
  )
}

export default Home
