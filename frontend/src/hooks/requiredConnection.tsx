import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { Button } from '@/src/components/buttons/Button'
import { ChainNames, mapId2Name } from '@/src/config/wagmi'
import { chainsConfig } from '@/src/config/web3'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 0 auto 10px;
  padding: 0 20px;
  text-align: center;
  text-decoration: none;
  width: 100%;
`

const TextBig = styled(Text)`
  font-size: 1.3rem;
`

type RequiredConnectionProps = {
  children: ReactElement
  minHeight?: number
  isNotConnectedText?: string
  isWrongNetworkText?: string
  networkToCheck?: ChainNames
}

const RequiredConnection: React.FC<RequiredConnectionProps> = ({
  children,
  isNotConnectedText = 'You must be logged in.',
  isWrongNetworkText = `Please switch to app network`,
  minHeight,
  ...restProps
}) => {
  const { address, appChainId, chainId, connectWallet, isWalletConnected, pushNetwork } =
    useWeb3Connection()
  const isConnected = isWalletConnected && address
  const isWrongNetwork = isConnected && chainId !== appChainId

  if (!isConnected) {
    return (
      <Wrapper style={{ minHeight }} {...restProps}>
        {!!isNotConnectedText.length && <Text>{isNotConnectedText}</Text>}
        <Button onClick={connectWallet}>Connect wallet</Button>
      </Wrapper>
    )
  }

  if (isWrongNetwork) {
    return (
      <Wrapper style={{ minHeight }} {...restProps}>
        {!!isWrongNetworkText.length && <TextBig>{isWrongNetworkText}</TextBig>}
        <Button
          onClick={() => pushNetwork({ chainId: chainsConfig[mapId2Name[appChainId]].chainIdHex })}
        >
          Switch to {chainsConfig[mapId2Name[appChainId]].name}
        </Button>
      </Wrapper>
    )
  }

  return children
}

export { RequiredConnection }
