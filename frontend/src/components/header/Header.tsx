import React, { useState } from 'react'
import styled from 'styled-components'

import { Button } from '@/src/components/buttons/Button'
import { UserDropdown } from '@/src/components/header/UserDropdown'
import WrongNetwork from '@/src/components/utils/WrongNetwork'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { InnerContainer } from '@/src/components/helpers/InnerContainer'

const Wrapper = styled.header`
  align-items: center;
  color: ${({ theme }) => theme.header.color};
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  padding: 48px 0;
`

const Container = styled(InnerContainer)`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  height: 100%;
  justify-content: space-between;

`

const Start = styled.div`
  align-items: center;
  column-gap: 20px;
  display: flex;
  justify-content: flex-start;
`

const Logo = styled.strong`
  font-size: 1.8rem;
  font-weight: 400;
`

const End = styled.div`
  align-items: center;
  column-gap: 40px;
  display: flex;
  height: 100%;
  justify-content: flex-end;
`

const UserControls = styled.div`
  align-items: center;
  column-gap: 15px;
  display: flex;
  height: 100%;
`

export const Header: React.FC = (props) => {
  const { connectWallet, isWalletConnected, isWalletNetworkSupported } = useWeb3Connection()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <Wrapper {...props}>
        <Container>
          <Start>
            <Logo>Anon Voting</Logo>
          </Start>
          <End>
            <WrongNetwork />
            {isWalletConnected && (
              <UserControls>
                <UserDropdown />
              </UserControls>
            )}
            {!isWalletConnected && <Button variant='primary' onClick={connectWallet}>Connect wallet</Button>}
          </End>
        </Container>
      </Wrapper>
    </>
  )
}
