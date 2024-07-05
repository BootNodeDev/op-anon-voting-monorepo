import { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

import { ChevronDown } from '@/src/components/assets/ChevronDown'
import { Button } from '@/src/components/buttons/Button'

const Chevron = styled(ChevronDown)`
  margin-left: auto;
  transition: transform 0.15s ease-in-out;

  .isOpen & {
    transform: rotate(180deg);
  }

  path {
    fill: ${({
      theme: {
        button: { dropdown },
      },
    }) => dropdown.color};
  }
`
const DropdownButton = styled(Button)`
  width: 100%;
`

export const ButtonDropdown: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...restProps
}) => {
  return (
    <DropdownButton variant={'dropdown'} {...restProps}>
      {children}
      <Chevron />
    </DropdownButton>
  )
}
