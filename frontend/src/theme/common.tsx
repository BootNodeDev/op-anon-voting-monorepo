/* Properties common to any themes                     */
/* Add dimensions, fonts, paddings, margins, etc. here */

const borderRadius = '2px'
const radioAndCheckDimensions = '40px'
const componentPaddingHorizontal = '24px'
const componentPaddingVertical = '24px'

export const common = {
  common: {
    borderRadius: borderRadius,
  },
  fonts: {
    defaultSize: '1.6rem',
    family:
      "'Work Sans', 'Helvetica Neue', 'Arial', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'",
    familyCode: "'source-code-pro', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'",
  },
  checkBox: {
    dimensions: radioAndCheckDimensions,
  },
  radioButton: {
    dimensions: radioAndCheckDimensions,
  },
  dropdown: {
    borderRadius: borderRadius,
  },
  header: {
    height: '60px',
  },
  layout: {
    horizontalPaddingDesktopStart: '24px',
    horizontalPaddingDesktopWideStart: '24px',
    horizontalPaddingMobile: '8px',
    horizontalPaddingTabletLandscapeStart: '16px',
    horizontalPaddingTabletPortraitStart: '16px',
    maxWidth: '1280px',
  },
  breakPoints: {
    desktopStart: '1025px',
    desktopWideStart: '1281px',
    tabletLandscapeStart: '769px',
    tabletPortraitStart: '481px',
  },
  card: {
    borderRadius: borderRadius,
    paddingHorizontal: componentPaddingHorizontal,
    paddingVertical: componentPaddingVertical,
  },
}
