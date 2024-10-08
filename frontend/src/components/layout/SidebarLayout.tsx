import { PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

import { Main as BaseMain } from '@/src/components/layout/Main'
import { Sidebar as BaseSidebar } from '@/src/components/layout/Sidebar'

export type SidebarPlacement = 'right' | 'left' | undefined

interface Props {
  sidebarPlacement?: SidebarPlacement
}

const Wrapper = styled.div<Props>`
  display: grid;
  row-gap: 20px;

  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    --sidebar-width: 360px;

    column-gap: 30px;
    flex-grow: 1;

    ${({ sidebarPlacement }) =>
      (sidebarPlacement === 'left' || sidebarPlacement === undefined) &&
      css`
        grid-template-columns: var(--sidebar-width) 1fr;
      `}

    ${({ sidebarPlacement }) =>
      sidebarPlacement === 'right' &&
      css`
        grid-template-columns: 1fr var(--sidebar-width);
      `}
  }
`

const Sidebar = styled(BaseSidebar)<Props>`
  order: 1;

  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    ${({ sidebarPlacement }) =>
      (sidebarPlacement === 'left' || sidebarPlacement === undefined) &&
      css`
        order: 0;
      `}

    ${({ sidebarPlacement }) =>
      sidebarPlacement === 'right' &&
      css`
        order: 1;
      `}
  }
`

const Main = styled(BaseMain)<Props>`
  order: 0;

  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    padding-top: 10px;

    ${({ sidebarPlacement }) =>
      (sidebarPlacement === 'left' || sidebarPlacement === undefined) &&
      css`
        order: 1;
      `}
    ${({ sidebarPlacement }) =>
      sidebarPlacement === 'right' &&
      css`
        order: 0;
      `};
  }
`

export const SidebarLayout: React.FC<PropsWithChildren<Props>> = ({
  children,
  sidebarPlacement = 'left',
  ...restProps
}) => (
  <Wrapper sidebarPlacement={sidebarPlacement} {...restProps}>
    <Sidebar sidebarPlacement={sidebarPlacement} />
    <Main sidebarPlacement={sidebarPlacement}>{children}</Main>
  </Wrapper>
)
