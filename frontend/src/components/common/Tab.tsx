import styled, { css } from 'styled-components'

export const TabsWrapper = styled.div`
  display: flex;
  gap: 16px;
`

export const Tab = styled.button<{ disabled?: boolean; checked?: boolean }>`
  align-items: center;
  column-gap: 16px;
  padding: 16px;
  border-radius: 0px;
  border: none;
  border-bottom: 2px solid transparent;
  background-color: ${({ checked, theme: { tab } }) =>
    checked ? tab.backgroundColorActive : tab.backgroundColor};
  color: ${({ checked, theme: { tab } }) => (checked ? tab.textColorActive : tab.textColor)};
  border-bottom-color: ${({ checked, theme: { tab } }) =>
    checked ? tab.BorderColorActive : tab.BorderColor};
  display: flex;
  flex: 1 1 0;
  font-size: 1.6rem;
  ${({ disabled }) =>
    disabled
      ? css`
          cursor: not-allowed;
          opacity: 0.5;

          .label {
            cursor: not-allowed;
          }
        `
      : css`
          cursor: pointer;
          &:hover,
          &:focus-visible {
            border-bottom-color: ${({ theme: { tab } }) => tab.BorderColorActive};
            color: ${({ theme: { tab } }) => tab.BorderColorActive};
          }
        `}
`
