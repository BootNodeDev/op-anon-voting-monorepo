import styled, { css } from 'styled-components'

// Button variants, you can add more here: secondary, tertiary, etc.
// Remember to add them to the theme file (light.ts, dark.ts, etc)
enum ButtonVariant {
  dropdown = 'dropdown',
  primary = 'primary',
  primaryInverted = 'primaryInverted',
}

type ButtonType = `${ButtonVariant}` | undefined

interface ButtonThemeProps {
  backgroundColor: string
  backgroundColorHover: string
  borderColor: string
  borderColorHover: string
  color: string
  colorHover: string
}

export interface ButtonProps {
  variant?: ButtonType
}

export const DisabledButtonCSS = css`
  &[disabled],
  &[disabled]:hover {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const ActiveButtonCSS = css`
  &:active {
    opacity: 0.7;
  }
`

// General button styles
export const ButtonCSS = css<ButtonProps>`
  align-items: center;
  border-radius: 2px;
  border-style: solid;
  border-width: 1px;
  column-gap: 8px;
  cursor: pointer;
  display: flex;
  font-family: ${({ theme: { fonts } }) => fonts.family};
  font-size: 1.6rem;
  font-weight: 400;
  justify-content: center;
  line-height: 1;
  outline: none;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  transition: all 0.15s ease-out;
  user-select: none;
  white-space: nowrap;

  ${ActiveButtonCSS}
`

// This adds the variant's colors to the button
export const buttonVariantCSS = (props: ButtonThemeProps) => {
  const {
    backgroundColor,
    backgroundColorHover,
    borderColor,
    borderColorHover,
    color,
    colorHover,
  } = props

  return css`
    background-color: ${backgroundColor};
    border-color: ${borderColor};
    color: ${color};

    &:hover {
      background-color: ${backgroundColorHover};
      border-color: ${borderColorHover};
      color: ${colorHover};
    }

    ${DisabledButtonCSS}

    &[disabled],
    &[disabled]:hover {
      background-color: ${backgroundColor};
      border-color: ${borderColor};
      color: ${color};
    }
  `
}

export const Button = styled.button<ButtonProps>`
  ${ButtonCSS}

  ${({ theme: { button }, variant }) => {
    const buttonProps = button[variant as string]

    return variant && buttonProps && buttonVariantCSS(buttonProps)
  }}
`

Button.defaultProps = {
  variant: 'primary',
  type: 'button',
}
