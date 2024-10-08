import { ChangeEvent } from 'react'
import styled, { css } from 'styled-components'

import { DebounceInput } from 'react-debounce-input'

import { ButtonDropdown } from '@/src/components/buttons/ButtonDropdown'
import { Dropdown, DropdownItem } from '@/src/components/common/Dropdown'
import { TextfieldCSS } from '@/src/components/form/Textfield'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { useTokensLists } from '@/src/hooks/useTokensLists'
import { Token } from '@/types/token'

const Wrapper = styled(Dropdown)`
  --inner-padding: 8px;

  .dropdownItems {
    max-height: 280px;
    overflow: auto;
  }
`

const TextfieldContainer = styled.div<{ closeOnClick?: boolean }>`
  background-color: ${({ theme }) => theme.dropdown.background};
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  padding: var(--inner-padding);
  position: sticky;
  top: 0;
  z-index: 1;
`

const Textfield = styled(DebounceInput)`
  ${css`
    ${TextfieldCSS};

    flex-shrink: 0;
    max-width: 100%;
    width: auto;
  `}
`

const NoResults = styled.div<{ closeOnClick?: boolean }>`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  display: flex;
  font-size: 1.3rem;
  font-weight: 500;
  height: 80px;
  justify-content: center;
  line-height: 1.2;
  padding: var(--inner-padding);
`

export const TokenDropdown: React.FC<{ onChange?: (token: Token | null) => void }> = ({
  onChange,
  ...restProps
}) => {
  const { onSelectToken, searchString, setSearchString, token, tokensList } =
    useTokensLists(onChange)

  return (
    <Wrapper
      dropdownButton={
        <ButtonDropdown>
          {token && <TokenIcon symbol={token.symbol} />}
          {token ? token.symbol : 'Select a token...'}
        </ButtonDropdown>
      }
      items={[
        <TextfieldContainer closeOnClick={false} key="tokenSearchInput">
          <Textfield
            debounceTimeout={300}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchString(e.target.value)}
            placeholder="Search token..."
            type="search"
            value={searchString}
          />
        </TextfieldContainer>,
        ...tokensList.map((item, index) => (
          <DropdownItem
            key={index}
            onClick={() => {
              onSelectToken(item)
            }}
          >
            <TokenIcon symbol={item.symbol} />
            {item.symbol}
          </DropdownItem>
        )),
        tokensList.length === 0 ? <NoResults closeOnClick={false}>Not found.</NoResults> : <></>,
      ]}
      {...restProps}
    />
  )
}

export default TokenDropdown
