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
export const PageTitle = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 1.6;
  margin: 0 0 0px;
  max-width: 100%;
  strong {
    font-weight: 600;
  }
  &:last-child {
    margin-bottom: 0;
  }
  @media (min-width: ${({ theme }) => theme.breakPoints.tabletPortraitStart}) {
    font-size: 1.9rem;
  }
  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    font-size: 2.1rem;
  }
`
