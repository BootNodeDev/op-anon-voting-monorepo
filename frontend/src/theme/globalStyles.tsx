import { createGlobalStyle } from 'styled-components'

import { onBoardCSS } from '@/src/theme/onBoard'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GlobalStyles = createGlobalStyle<{ theme?: any }>`
  html {
    font-size: 10px;
    scroll-behavior: smooth;
  }

  body {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    background-color: ${({ theme: { body } }) => body.backgroundColor};
    background-size: cover;
    color: ${({ theme: { colors } }) => colors.textColor};
    font-family: ${({ theme: { fonts } }) => fonts.family};
    font-size: ${({ theme: { fonts } }) => fonts.defaultSize};
    min-height: 100vh;
    outline-color: ${({ theme: { colors } }) => colors.secondary};
    position: relative;
    &::before{
      content: '';
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      width: 100%;
      height: 500px;
      background-color: ${({ theme: { colors } }) => colors.lightestGray};
      z-index: -1;
      @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
        height: 600px;
  }
    }
  }

  code {
    font-family: ${({ theme: { fonts } }) => fonts.familyCode};
  }

  #__next {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
  }

  hr {
    display: block;
    height: auto;
    margin: 30px 0;
    width: 100%;
  }

  a {
    color: ${({ theme: { colors } }) => colors.textColor};
  }

  ${onBoardCSS}
`
