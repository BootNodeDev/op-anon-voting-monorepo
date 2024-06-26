import React, { useState } from 'react'
import styled from 'styled-components'

import { ModalSwitchNetwork } from '@/src/components/helpers/ModalSwitchNetwork'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div`
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  display: flex;
  align-items: center;
  color: ${({ theme: { colors } }) => colors.error};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const WrongNetwork: React.FC = ({ ...restProps }) => {
  const { isWalletConnected, isWalletNetworkSupported } = useWeb3Connection()
  const [showNetworkModal, setShowNetworkModal] = useState(false)

  return isWalletConnected && !isWalletNetworkSupported ? (
    <>
      <Wrapper onClick={() => setShowNetworkModal(true)} {...restProps}>
        Switch to a valid network
      </Wrapper>
      {showNetworkModal && <ModalSwitchNetwork onClose={() => setShowNetworkModal(false)} />}
    </>
  ) : null
}

export default WrongNetwork
