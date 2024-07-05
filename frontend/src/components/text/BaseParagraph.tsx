import styled from 'styled-components'

export const BaseParagraph = styled.p`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.6;
  margin: 0 0 20px;
  max-width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
`

export const BigParagraph = styled.p`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 1.6;
  margin: 0 0 20px;
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
