import styled from 'styled-components'

export const BaseCard = styled.div`
  background-color: ${({ theme: { card } }) => card.backgroundColor};
  border-radius: ${({ theme: { card } }) => card.borderRadius};
  border: 1px solid ${({ theme: { card } }) => card.borderColor};
  box-shadow: ${({ theme: { card } }) => card.boxShadow};
  padding: ${({ theme: { card } }) => card.paddingVertical}
    calc(${({ theme: { card } }) => card.paddingHorizontal} / 2);
  width: 100%;
  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    padding: ${({ theme: { card } }) => card.paddingVertical}
      ${({ theme: { card } }) => card.paddingHorizontal};
  }
`
