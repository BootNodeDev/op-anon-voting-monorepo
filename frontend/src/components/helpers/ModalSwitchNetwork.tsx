import styled from 'styled-components'

import { Button } from '@/src/components/buttons/Button'
import { Modal } from '@/src/components/common/Modal'
import { ChainIds } from '@/src/config/wagmi'
import { chainsConfig } from '@/src/config/web3'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const NetworkButtons = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 200px;
  row-gap: 8px;
  width: 100%;
`

const NetworkButton = styled(Button)`
  width: 100%;
  padding: 16px;

  &:active {
    opacity: 0.7;
  }

  &:hover {
    border-color: ${({ theme: { colors } }) => colors.lighterGreen};
  }
`

export const ModalSwitchNetwork: React.FC<{ onClose: () => void }> = ({
  onClose,
  ...restProps
}) => {
  const { pushNetwork, setAppChainId } = useWeb3Connection()
  const chainOptions = Object.values(chainsConfig)

  return (
    <Modal onClose={onClose} size="sm" title="Choose a network" {...restProps}>
      <NetworkButtons>
        {chainOptions.map((item, index) => (
          <NetworkButton
            key={index}
            onClick={() => {
              setAppChainId(item.id as ChainIds)
              pushNetwork({ chainId: item.chainIdHex })
              onClose()
            }}
          >
            {item.name}
          </NetworkButton>
        ))}
      </NetworkButtons>
    </Modal>
  )
}
