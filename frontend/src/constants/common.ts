export const appName = process.env.NEXT_PUBLIC_APP_NAME || 'letsHopeWeCanAvoidNameClashingThen'
export const cookiesWarningEnabled =
  process.env.NEXT_PUBLIC_COOKIES_WARNING_ENABLED === 'true' || ''
export const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''
export const defaultChainId = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID)

export const MESSAGE_TO_SIGN = 'BOOT_NODE_ANON_VOTING'
export const MT_DEPTH = 16
export const PASSWORD = ''
