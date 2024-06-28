/* Light Theme           */
/* Add only colors here. */

import { darken, rgba } from 'polished'

const error = '#FF9DBA'
const success = '#25DFD4'
const primary = '#5C5EED'
const darkPrimary = darken(0.2, primary)
const secondary = '#E56399'
const tertiary = '#A6CFD5'
const textColor = '#152445'
const darktextColor = darken(0.2, textColor)
const borderColor = rgba(textColor, 0.1)
const gray = '#909AB2'
const lighterGray = '#F3F3F3'
const lightestGray = '#F7F8FC'
const darkGray = '#7E8AA5'
const darkGrayDarkened = darken(0.1, '#fff')
const darkBlue = 'rgb(6, 75, 141)'
const componentBackgroundColor = 'rgba(255, 255, 255, 0.95)'
const white = '#fff'

export const light = {
  body: {
    backgroundColor: white,
    backgroundImage:
      'linear-gradient(80deg,rgba(17,10,10,0.2) 15%,rgba(92,33,52,0.2) 33%,rgba(6,75,141,0.2) 65%,rgba(13,2,2,0.1) 98%)',
  },
  button: {
    dropdown: {
      backgroundColor: white,
      backgroundColorHover: darkGrayDarkened,
      borderColor: borderColor,
      borderColorHover: borderColor,
      color: textColor,
      colorHover: textColor,
    },
    primary: {
      backgroundColor: primary,
      backgroundColorHover: darkPrimary,
      borderColor: primary,
      borderColorHover: darkPrimary,
      color: white,
      colorHover: white,
    },
    primaryInverted: {
      backgroundColor: textColor,
      backgroundColorHover: darktextColor,
      borderColor: textColor,
      borderColorHover: borderColor,
      color: white,
      colorHover: white,
    },
  },
  card: {
    backgroundColor: white,
    borderColor: white,
    boxShadow:
      '0px 41px 80px 0px rgba(0, 0, 0, 4%), 0px 20.756250381469727px 34.875px 0px rgba(0, 0, 0, 3%), 0px 8.199999809265137px 13px 0px rgba(0, 0, 0, 2%), 0px 1.7937500476837158px 4.625px 0px rgba(0, 0, 0, 1%)',
  },
  checkBox: {
    backgroundColorActive: primary,
    backgroundColor: '#fff',
    borderColor: borderColor,
  },
  colors: {
    borderColor: borderColor,
    componentBackgroundColor: componentBackgroundColor,
    darkBlue: darkBlue,
    lighterGray: lighterGray,
    lightestGray: lightestGray,
    gray: gray,
    darkGray: darkGray,
    darkGrayDarkened: darkGrayDarkened,
    error: error,
    primary: primary,
    darkPrimary: darkPrimary,
    secondary: secondary,
    success: success,
    tertiary: tertiary,
    textColor: textColor,
    darktextColor: darktextColor,
    white: white,
  },
  dropdown: {
    background: '#fff',
    borderColor: borderColor,
    boxShadow: 'none',
    item: {
      backgroundColor: 'transparent',
      backgroundColorHover: lightestGray,
      borderColor: borderColor,
      color: textColor,
      colorDanger: error,
      colorHover: primary,
      colorOK: success,
    },
  },
  textField: {
    backgroundColor: '#fff',
    borderColor: borderColor,
    color: textColor,
    errorColor: error,
    successColor: success,
    active: {
      backgroundColor: '#fff',
      borderColor: primary,
      boxShadow: 'none',
      color: textColor,
    },
    placeholder: {
      color: '#999',
    },
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: textColor,
  },
  mainMenu: {
    color: textColor,
  },
  mobileMenu: {
    color: textColor,
    backgroundColor: '#fff',
    borderColor: borderColor,
  },
  modal: {
    overlayColor: 'rgba(255, 255, 255, 0.8)',
  },
  radioButton: {
    backgroundColorActive: primary,
    backgroundColor: white,
    borderColor: white,
  },
  onBoard: {
    backgroundColor: componentBackgroundColor,
    color: textColor,
    borderRadius: '5px',
    borderColor: borderColor,
    sidebarBackgroundColor: 'rgb(235, 235, 237)',
  },
  toast: {
    backgroundColor: componentBackgroundColor,
    borderColor: borderColor,
    boxShadow: '0 0 10px 0 rgba(255, 255, 255, 0.25)',
  },
}
