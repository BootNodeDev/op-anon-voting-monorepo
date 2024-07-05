import styled from 'styled-components'

import { Dropdown } from './Dropdown'
import { Button } from '@/src/components/buttons/Button'
import { BaseCard } from '@/src/components/common/BaseCard'
import { BaseTitle } from '@/src/components/text/BaseTitle'

export const Card = styled(BaseCard)`
  //min-height: 300px;
`
export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 950px;
`
export const IdentityWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
export const Title = styled(BaseTitle)`
  margin: 24px 0;
  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    margin: 80px 0;
  }
`
export const NotConnected = styled.div`
  padding: 32px 0px;
  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    padding: 48px 24px;
  }
`
export const BigButton = styled(Button)`
  padding: 24px 36px;
`
export const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`
export const VoteWrapper = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`
export const RadioButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
  width: 100%;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  row-gap: 10px;
  margin: 0 0 30px;

  &:last-child {
    margin-bottom: 0;
  }
`

export const WrapperDropdown = styled(Dropdown)`
  --inner-padding: 8px;
  width: 100%;
  display: flex;
  .dropdownItems {
    max-height: 340px;
    overflow: auto;
  }
`
export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
`
export const ColumnFullHeight = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-grow: 1;
  margin-top: 27px;
  button {
    height: 100%;
    flex: 1;
  }
`
