import { PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

import { LabelAlt as Label } from '@/src/components/form/Label'

export interface Props {
  checked?: boolean
  disabled?: boolean
  ended?: boolean
  onClick?: () => void
}

const Wrapper = styled.span<{ checked?: boolean; disabled?: boolean; ended?: boolean }>`
  align-items: center;
  column-gap: 16px;
  padding: 8px;
  border-radius: 60px;
  background-color: ${({ theme: { colors } }) => colors.lighterGray};
  display: flex;
  flex: 1 1 0;
  font-size: 1.6rem;
  ${({ disabled, ended }) =>
    disabled || ended
      ? css`
          cursor: not-allowed;
          opacity: 0.6;

          .label {
            cursor: not-allowed;
          }
        `
      : css`
          cursor: pointer;
        `}
  ${({ checked, ended }) =>
    ended &&
    checked &&
    css`
      border: 1px solid ${({ theme: { colors } }) => colors.primary};
      opacity: 1;
      label {
        font-weight: bold;
        color: ${({ theme: { colors } }) => colors.primary};
      }
    `}
  ${({ ended }) =>
    ended
      ? css`
          cursor: not-allowed;

          .label {
            cursor: not-allowed;
          }
        `
      : css`
          cursor: pointer;
        `}
`

const Radio = styled.span<Props>`
  background-color: ${({ checked, theme: { radioButton } }) =>
    checked ? radioButton.backgroundColorActive : radioButton.backgroundColor};
  border-color: ${({ theme: { radioButton } }) => radioButton.borderColor};
  border-radius: 50%;
  border-style: solid;
  border-width: 12px;
  box-sizing: border-box;
  flex-grow: 0;
  flex-shrink: 0;
  height: ${({ theme: { radioButton } }) => radioButton.dimensions};
  transition: all 0.15s linear;
  width: ${({ theme: { radioButton } }) => radioButton.dimensions};
  ${({ ended }) =>
    ended
      ? css``
      : css`
          cursor: pointer;
        `}
`

export const Radiobutton: React.FC<PropsWithChildren<Props>> = ({
  checked,
  children,
  disabled,
  ended,
  onClick,
  ...restProps
}) => {
  return (
    <Wrapper
      checked={checked}
      disabled={disabled}
      ended={ended}
      onClick={() => {
        if (disabled || ended) return

        if (typeof onClick !== 'undefined') {
          onClick()
        }
      }}
      {...restProps}
    >
      <Radio checked={checked} ended={ended} />
      {children && <Label>{children}</Label>}
    </Wrapper>
  )
}
