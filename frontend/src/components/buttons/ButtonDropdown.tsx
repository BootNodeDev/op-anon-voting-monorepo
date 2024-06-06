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

export const ButtonDropdown: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...restProps
}) => {
  return (
    <Button variant={'dropdown'} {...restProps}>
      {children}
      <Chevron />
    </Button>
  )
}
