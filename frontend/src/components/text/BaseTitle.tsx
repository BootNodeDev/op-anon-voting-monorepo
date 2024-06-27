import styled from 'styled-components'

export const BaseTitle = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 2.4rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 0 0 24px;

  @media (min-width: ${({ theme }) => theme.breakPoints.tabletPortraitStart}) {
    font-size: 2.8rem;
  }
  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    font-size: 3.6rem;
  }
`
