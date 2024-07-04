import { HTMLAttributes, ReactElement } from 'react'
import styled, { css } from 'styled-components'

import { Information } from '@/src/components/assets/Information'

const Wrapper = styled.div<{ isError?: boolean }>`
  border-radius: 6px;
  gap: 16px;
  background-color: ${({ theme: { colors } }) => colors.lightestGray};
  border: 1px solid ${({ theme: { colors } }) => colors.lighterGray};
  color: ${({ theme: { colors } }) => colors.error};
  padding: 16px;
  padding-right: 24px;
  font-size: 1.6rem;
  font-weight: 400;
  display: flex;
  flex-direction: row;
  line-height: 1.4;
  text-align: left;
  align-items: center;
  ${({ isError }) =>
    isError
      ? css`
          color: ${({ theme: { colors } }) => colors.error};
        `
      : css`
          color: ${({ theme: { colors } }) => colors.success};
        `}
`
const Icon = styled.div`
  flex-shrink: 0;
`
interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactElement
  isError?: boolean
}

export const AlertMessage: React.FC<Props> = ({ children, isError, ...restProps }: Props) => {
  return (
    <Wrapper {...restProps} isError={isError}>
      <Icon>
        <Information />
      </Icon>
      <div>{children}</div>
    </Wrapper>
  )
}
