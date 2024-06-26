import { useState } from 'react'
import styled from 'styled-components'

import { Link as BaseLink } from '@/src/components/assets/Link'
import { Logout } from '@/src/components/assets/Logout'
import { SwitchNetwork } from '@/src/components/assets/SwitchNetwork'
import { DropdownPosition } from '@/src/components/common/Dropdown'
import { Dropdown } from '@/src/components/header/Helpers'
import { ModalSwitchNetwork } from '@/src/components/helpers/ModalSwitchNetwork'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { truncateStringInTheMiddle } from '@/src/utils/strings'
import { MenuDots } from '@/src/components/assets/MenuDots'
import Blockies from 'react-blockies'
import { Copy } from '@/src/components/assets/Copy'
import { ArrowRight } from '@/src/components/assets/ArrowRight'
import { ToastComponent } from '@/src/components/toast/ToastComponent'
import toast, { Toast } from 'react-hot-toast'

const Wrapper = styled(Dropdown)`
  .dropdownButton {
    padding: 0;
  }

  .dropdownItems {
    width: 300px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: ${({ theme: { card } }) => card.boxShadow};
  }
`

const Item = styled.div`
  align-items: center;
  background-color: ${({ theme: { dropdown } }) => dropdown.item.backgroundColor};
  border-bottom: 1px solid ${({ theme: { dropdown } }) => dropdown.item.borderColor};
  color: ${({ theme: { dropdown } }) => dropdown.item.color};
  column-gap: 16px;
  cursor: pointer;
  display: flex;
  font-size: 1.4rem;
  font-weight: 400;
  justify-content: space-between;
  line-height: 1.2;
  overflow: hidden;
  padding: 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;

  &:hover {
    color: ${({ theme: { dropdown } }) => dropdown.item.colorHover};
    background-color: ${({ theme: { dropdown } }) => dropdown.item.backgroundColorHover};
  }

  &:last-child {
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    border-bottom: none;
  }

  path.fill {
    fill: ${({ theme: { dropdown } }) => dropdown.item.color};
  }
`

const ItemDirectionColumn = styled.div`
  align-items: flex-start;
  flex-direction: column;
`

const AddressRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: ${({ theme: { colors } }) => colors.lighterGray};
  padding: 24px;
`

const Link = styled(BaseLink)`
  .fill {
    fill: #fff;
  }
`

const UserButton = styled.button`
  background-color: ${({ theme: { colors } }) => colors.white};
  cursor: pointer;
  padding: 0;
  position: relative;
  border-radius: 40px;
  line-height: 2;
  font-size: 1.4rem;
  padding: 8px 16px;
  border: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  display: flex;
  align-items: center;
  gap: 8px;
`
const Avatar = styled.div`
  overflow: hidden;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`
const SmallCircle = styled.div<{ state?: 'ok' | 'error' }>`
  --ball-dimensions: 10px;

  background-color: ${({ state, theme: { colors } }) =>
    state === 'ok' ? colors.ok : colors.error};
  border-radius: 50%;
  top: 10px;
  height: var(--ball-dimensions);
  left: 12px;
  position: absolute;
  width: var(--ball-dimensions);
  z-index: 5;
`

SmallCircle.defaultProps = { state: 'error' }

const AddressInformation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 24px;
`
const Account = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 16px;
  font-size: 1.8rem;
  font-weight: 600;
  `
const AddressActions = styled.div`
display: flex;
  width: 100%;
  gap: 8px;
`
const ActionButton = styled.button`
  background-color: ${({ theme: { colors } }) => colors.white};
  border: none;
  cursor: pointer;
  display: flex;
  gap: 8px;
  flex: 1 1 0px;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 4px;
  font-size: 1.4rem;
  &:hover{
    background-color: ${({ theme: { colors } }) => colors.lightGrey};
    color: ${({ theme: { colors } }) => colors.primary};
  }
`


export const UserDropdown: React.FC = ({ ...restProps }) => {
  const { address, disconnectWallet, getExplorerUrl, isWalletNetworkSupported } =
    useWeb3Connection()
  const [showNetworkModal, setShowNetworkModal] = useState(false)
  const [toastId, setToastId] = useState('')

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.remove(toastId)
    toast.custom(
      (t: Toast) => {
        setToastId(t.id)
        return <ToastComponent message={'Address copied'} t={t} />
      },
      {
        duration: 1000,
        position: 'top-right',
      },
    )
  }
  return (
    <>
      <Wrapper
        dropdownButton={
          <UserButton>
            {address ? (
              <>
                <Avatar>
                  <Blockies scale={2.4} seed={address} size={10} />
                </Avatar>
                {truncateStringInTheMiddle(address, 6, 4)} <MenuDots />
              </>
            ) : (
              'Error'
            )}
            <SmallCircle state={isWalletNetworkSupported ? 'ok' : 'error'} />
          </UserButton>
        }
        dropdownPosition={DropdownPosition.right}
        items={[
          <ItemDirectionColumn key="0">
            <AddressRow>
              {address ? (
                <AddressInformation>
                  <Account>
                    <Avatar>
                      <Blockies scale={5.6} seed={address} size={10} />
                    </Avatar>
                    {truncateStringInTheMiddle(address, 6, 4)}
                    </Account>
                  <AddressActions>
                    <ActionButton onClick={() => copyAddress(address)}><Copy /> Copy</ActionButton>
                    <ActionButton onClick={disconnectWallet}><Logout /> Disconnect</ActionButton>
                  </AddressActions>
                </AddressInformation>
              ) : (
                'Error'
              )}
            </AddressRow>
          </ItemDirectionColumn>,
          <Item key="1" onClick={() => setShowNetworkModal(true)}>
            <span>Switch network</span>
            <SwitchNetwork />
          </Item>,
          <Item key="2" onClick={() => window.open(getExplorerUrl(address || ''), '_blank')}>
            <span>View more in explorer</span> <ArrowRight />
          </Item>,
        ]}
        {...restProps}
      />
      {showNetworkModal && <ModalSwitchNetwork onClose={() => setShowNetworkModal(false)} />}
    </>
  )
}
