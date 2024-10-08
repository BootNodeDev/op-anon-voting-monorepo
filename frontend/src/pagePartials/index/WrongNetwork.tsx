import styled, { keyframes } from 'styled-components'

import { Button } from '@/src/components/buttons/Button'
import { mapId2Name } from '@/src/config/wagmi'
import { getNetworkConfig } from '@/src/config/web3'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const loadingAnimation = keyframes`
  0% {
    opacity: var(--inline-loading-opacity-start);
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: var(--inline-loading-opacity-start);
  }
`

const Content = styled.div`
  --inline-loading-opacity-start: 0.4;

  animation-delay: 0;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-name: ${loadingAnimation};
  animation-timing-function: ease-in-out;
  color: ${({ theme }) => theme.colors.error};
  font-style: italic;

  display: flex;
  align-items: center;
`

export default function WrongNetwork() {
  const { appChainId, isWalletConnected, isWalletNetworkSupported, pushNetwork } =
    useWeb3Connection()
  const appChain = getNetworkConfig(mapId2Name[appChainId])
  return isWalletConnected && !isWalletNetworkSupported ? (
    <Button onClick={() => pushNetwork({ chainId: appChain.chainIdHex })}>
      <Content>Swich to valid network</Content>
    </Button>
  ) : null
}
