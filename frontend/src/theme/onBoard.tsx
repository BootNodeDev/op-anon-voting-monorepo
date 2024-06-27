import { css } from 'styled-components'

export const onBoardCSS = css`
  :root {
    // font families
    --onboard-font-family-normal: ${({ theme }) => theme.fonts.family};
    --onboard-font-family-semibold: ${({ theme }) => theme.fonts.family};
    --onboard-font-family-light: ${({ theme }) => theme.fonts.family};
    --account-select-modal-font-family-normal: ${({ theme }) => theme.fonts.family};
    --account-select-modal-font-family-light: ${({ theme }) => theme.fonts.family};
    --onboard-font-family-title: ${({ theme: { fonts } }) => fonts.familyCondensed};

    // font sizes
    --font-size-xl: 1.6rem;
    --font-size-lg: 1.4rem;
    --font-size-md: 1.2rem;

    --onboard-font-size-3: var(--font-size-xl);
    --onboard-font-size-5: var(--font-size-xl);
    --account-select-modal-font-size-5: var(--font-size-xl);
    --onboard-font-size-6: var(--font-size-lg);
    --onboard-font-size-7: var(--font-size-md);
    --account-select-modal-font-size-7: var(--font-size-md);
    --account-select-modal-font-line-height-1: 1.4;

    // modal overlay
    --onboard-modal-backdrop: ${({ theme: { modal } }) => modal.overlayColor};

    // modal main
    --onboard-modal-border-radius: ${({ theme: { onBoard } }) => onBoard.borderRadius};
    --onboard-connect-sidebar-background: ${({ theme: { onBoard } }) =>
      onBoard.sidebarBackgroundColor};
    --onboard-main-scroll-container-background: ${({ theme: { onBoard } }) =>
      onBoard.backgroundColor};
    --onboard-connect-sidebar-border-color: ${({ theme: { onBoard } }) => onBoard.borderColor};
    --w3o-border-color: ${({ theme: { onBoard } }) => onBoard.borderColor};
    --onboard-warning-400: ${({ theme: { colors } }) => colors.primary};
    --onboard-success-600: ${({ theme: { colors } }) => colors.success};
    --onboard-success-700: ${({ theme: { colors } }) => colors.success};
    --onboard-primary-light: ${({ theme: { colors } }) => colors.secondary};
    --onboard-primary-500: ${({ theme: { colors } }) => colors.secondary};

    // modal header
    --onboard-connect-header-background: transparent;
    --onboard-connect-header-color: ${({ theme: { onBoard } }) => onBoard.color};
    --onboard-connect-sidebar-progress-color: ${({ theme: { colors } }) => colors.primary};
    --onboard-connect-sidebar-progress-background: ${({ theme: { colors } }) => colors.black};
    --onboard-text-color: ${({ theme: { colors } }) => colors.textColor};
    --onboard-text-colorDark: ${({ theme: { colors } }) => colors.darkPrimary};
    --onboard-text-colorWhite: ${({ theme: { colors } }) => colors.white};

    // buttons
    --onboard-wallet-button-border-radius: 8px;
    --onboard-wallet-button-background: transparent;
    --onboard-wallet-button-background-hover: ${({ theme: { colors } }) => colors.lighterGray};
    --onboard-wallet-button-border-color: ${({ theme: { onBoard } }) => onBoard.borderColor};
    --onboard-wallet-button-color: ${({ theme: { colors } }) => colors.textColor};
    --onboard-wallet-button-color-hover: ${({ theme: { colors } }) => colors.textColor};
    --onboard-wallet-app-icon-border-color: ${({ theme: { onBoard } }) => onBoard.borderColor};
    --onboard-close-button-background-color: ${({ theme: { colors } }) => colors.darkGray};

    // Text
    --onboard-connect-sidebar-color: ${({ theme: { colors } }) => colors.textColor};
    --onboard-link-color: ${({ theme: { colors } }) => colors.primary};
    --onboard-warning-700: ${({ theme: { colors } }) => colors.textColor};
    --onboard-subtitle-color: ${({ theme: { colors } }) => colors.textColor};
  }
`
export const ModalCSS = `
.flex .modal-overflow {
  overflow: visible;
}

.fixed .modal {
  background-color: transparent;
  box-shadow: 0px 100px 80px rgba(68, 68, 68, 0.07), 0px 50.625px 34.875px rgba(43, 43, 43, 0.047), 0px 20px 13px rgba(45, 45, 45, 0.035), 0px 4.375px 4.625px rgba(71, 71, 71, 0.023);
  overflow: visible;
}

@media (min-width: 768px) {
  .fixed .modal {
    border-radius: var(--onboard-modal-border-radius);
  }
}

.fixed .modal .container {
  border-radius: 8px;
  margin-top: 0;
  background-color: transparent;
}
.fixed .modal .connecting-container{
  border-radius: 8px;
  background-color: transparent;
  color: var(--onboard-text-color);
}

/* Sidebar */
.fixed .modal .sidebar {
  border-radius: 0;
  display: flex;
  padding: 36px;
  width: 100%;
  background-color: var(--onboard-connect-sidebar-background);
}

.fixed .modal .sidebar .inner-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  padding: 0;
  border:none;
}

.fixed .modal .sidebar > div:last-child {
  display: none !important;
}

/* Sidebar title */
.fixed .modal .sidebar .subheading {
  font-family: var(--onboard-font-family-title);
  text-transform: uppercase;
  font-weight: 400;
  font-size: 1.6rem;
  line-height: 1.2;
  margin: 0 0 16px;
  color: var(--onboard-subtitle-color);
}

/* Sidebar description */
.fixed .modal .sidebar .description {
  font-weight: 400;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 32px;
}

.fixed .modal .sidebar .indicators {
  margin: 0;
}

/* Content */
.fixed .modal .content {
  background-color: var(--onboard-main-scroll-container-background);
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  justify-content: center;
  padding: 36px;
  width: 100%;
}

.fixed .modal .content .header {
  border: none;
  padding: 0;
}

.fixed .modal .content .button-container {
  height: 30px;
  right: 5px;
  top: 5px;
  width: 30px;
  padding: 5px;
  background-color: var(--onboard-close-button-background-color);
  border-radius: 50%;
}

.fixed .modal .content .button-container > div {
  height: 100%;
  width: 100%;
}

.fixed .modal .content .button-container .close-button {
  background: no-repeat center url('data:image/svg+xml;base64, PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNSAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzLjUzMTUgMTIuMjEzOEwxLjgzMTg5IDAuNTE0MTM4QzEuNTQ3OTUgMC4yMzAxOTYgMS4wMjI3NCAwLjI5NTAxMSAwLjY1ODg0OCAwLjY1ODkwMUMwLjI5NDk1OCAxLjAyMjc5IDAuMjMwMTQ0IDEuNTQ4IDAuNTE0MDg2IDEuODMxOTRMMTIuMjEzNyAxMy41MzE2QzEyLjQ5NzcgMTMuODE1NiAxMy4wMjI5IDEzLjc1MDcgMTMuMzg2OCAxMy4zODY4QzEzLjc1MDcgMTMuMDIyOSAxMy44MTU1IDEyLjQ5NzggMTMuNTMxNSAxMi4yMTM4WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEuODMyNDggMTMuNTMxN0wxMy41MzIxIDEuODMyMDFDMTMuODE2MSAxLjU0ODA3IDEzLjc1MTMgMS4wMjI4NiAxMy4zODc0IDAuNjU4OTdDMTMuMDIzNSAwLjI5NTA4MSAxMi40OTgzIDAuMjMwMjY2IDEyLjIxNDMgMC41MTQyMDhMMC41MTQ2OCAxMi4yMTM5QzAuMjMwNzEzIDEyLjQ5NzggMC4yOTU1NTIgMTMuMDIzIDAuNjU5NDQyIDEzLjM4NjlDMS4wMjMzMyAxMy43NTA4IDEuNTQ4NTEgMTMuODE1NiAxLjgzMjQ4IDEzLjUzMTdaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K') !important;
  height: 100%;
  width: 100%;
  color:  var(--onboard-subtitle-color);
}

.fixed .modal .content .button-container .close-button > div {
  display: none !important;
  align-items: center;
  justify-content: center;
}

.fixed .modal .content .mobile-header {
  border: none;
  gap: 16px;
  height: auto;
  padding: 0;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

/* Main title */
.fixed .modal .content .header-heading {
  color: var(--onboard-text-color);
  font-size: 1.4rem;
  line-height: 1.2;
  margin: 0 0 2px;
}


/* Mobile subtitle */
.fixed .modal .content .mobile-subheader {
  color: var(--onboard-subtitle-color);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0;
}

/* Wallets list */
.fixed .modal .content .wallets-container {
  display: flex;
  flex-direction: column;
  padding: 0;
  row-gap: 8px;
}

/* Wallet buttons (items) */
.fixed .modal .content .wallet-button-container button.wallet-button-styling {
  background: var( --onboard-wallet-button-background, var(--onboard-white, var(--white)) );
  border-radius: var( --onboard-wallet-button-border-radius, var(--border-radius-1) );
  border: 1px solid var( --onboard-wallet-button-border-color, var(--onboard-primary-200, var(--primary-200)) );
}
.fixed .modal .content .wallet-button-container button.wallet-button-styling:hover{
  background: var( --onboard-wallet-button-background-hover, var(--onboard-white, var(--white)) );
}

.fixed .modal .content .wallet-button-container-inner {
  column-gap: 10px;
  display: flex;
  flex-direction: row;
  width: 100%;
}

/* Wallet icon */
.fixed .modal .content .wallet-button-container-inner > div:first-child {
  align-items: center !important;
  background-color: --onboard-connect-sidebar-color !important;
  border-radius: 8px !important;
  display: flex !important;
  height: 58px !important;
  justify-content: center !important;
  width: 58px !important;
}
.fixed .modal .content .wallet-button-container-inner .icon{
  height: 100%;
  width: 100%;
  font-size: 0;
  line-height: 0;
}
.fixed .modal .content .wallet-button-container-inner .icon svg{
    width: 58px;
    height: 58px;
}

.fixed .modal .onboard-button-primary{
  align-items: center;
  border-radius: 4px;
  border-style: solid;
  border-width: 0px;
  column-gap: 16px;
  cursor: pointer;
  display: flex;
  font-family: var(--onboard-font-family-title);
  font-size: 1.4rem;
  font-weight: 400;
  height: 40px;
  justify-content: center;
  line-height: 1;
  outline: none;
  padding: 0 20px;
  text-align: center;
  text-decoration: none;
  transition: all 0.15s ease-out;
  user-select: none;
  white-space: nowrap;
  background-color: var(--onboard-link-color);
  border-color: 'transparent';
  color: var(--onboard-text-colorWhite);
}
.fixed .modal .onboard-button-primary:hover, .fixed .modal .onboard-button-primary:focus, .fixed .modal .onboard-button-primary:active {
  background-color: var(--onboard-text-colorDark) !important;
}



/* Tablets and above */
@media (min-width: 768px) {
  /* Sidebar */
  .fixed .modal .sidebar {
    border-bottom-left-radius: var(--onboard-modal-border-radius);
    border-top-left-radius: var(--onboard-modal-border-radius);
    max-width: 50%;
    width: 345px;
  }


  /* Main title */
  .fixed .modal .content .header-heading {
    margin: 0 0 28px;
  }
}
`
