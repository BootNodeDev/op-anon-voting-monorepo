import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { OnboardAPI } from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import { init, useConnectWallet, useSetChain, useWallets } from '@web3-onboard/react'
import walletConnectModule from '@web3-onboard/walletconnect'
import { createWalletClient, custom } from 'viem'
import { useAccount } from 'wagmi'
import { UseAccountReturnType } from 'wagmi'

import { ChainIds, chainIds, config, mapId2Name } from '@/src/config/wagmi'
import { chainsConfig, getNetworkConfig } from '@/src/config/web3'
import { appName } from '@/src/constants/common'
import {
  recoverLocalStorageKey,
  removeLocalStorageKey,
  setLocalStorageKey,
} from '@/src/hooks/usePersistedState'
import { ModalCSS } from '@/src/theme/onBoard'
import { ChainConfig } from '@/types/chains'
import { RequiredNonNull } from '@/types/utils'

const STORAGE_CONNECTED_WALLET = 'onboard_selectedWallet'

const injected = injectedModule()

const walletConnect = walletConnectModule({
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
  dappUrl: process.env.NEXT_PUBLIC_WC_DAPP_URL,
})

const chainsForOnboard = Object.values(chainsConfig).map(
  ({ chainIdHex, name, rpcUrl, token }: ChainConfig) => ({
    id: chainIdHex,
    label: name,
    token,
    rpcUrl,
  }),
)

let onBoardApi: OnboardAPI

export function initOnboard() {
  if (typeof window === 'undefined' || window?.onboard || onBoardApi) return

  onBoardApi = init({
    wallets: [injected, walletConnect],
    chains: chainsForOnboard,
    notify: {
      enabled: false,
    },
    appMetadata: {
      name: appName || '',
      icon: '<svg><svg/>', // brand icon
      description: 'Boontnode Web3 Frontend starter kit',
      recommendedInjectedWallets: [{ name: 'MetaMask', url: 'https://metamask.io' }],
    },
    // Account center put an interactive menu in the UI to manage your account.
    accountCenter: {
      desktop: {
        enabled: false,
      },
      mobile: {
        enabled: false,
      },
    },
    // i18n: {} change all texts in the onboard modal
  })
  window.onboard = onBoardApi
}

declare type SetChainOptions = {
  chainId: string
  chainNamespace?: string
}

export type Web3Context = {
  address: UseAccountReturnType['address']
  chainId: UseAccountReturnType<typeof config>['chainId']
  appChainId: ChainIds
  connectWallet: () => Promise<void> | null
  connectingWallet: boolean
  disconnectWallet: () => Promise<void> | null
  getExplorerUrl: (hash: string) => string
  isAppConnected: boolean
  isOnboardChangingChain: boolean
  isWalletConnected: boolean
  isWalletNetworkSupported: boolean
  pushNetwork: (options: SetChainOptions) => Promise<boolean>
  setAppChainId: Dispatch<SetStateAction<ChainIds>>
}

export type Web3Connected = RequiredNonNull<Web3Context>

const Web3ContextConnection = createContext<Web3Context | undefined>(undefined)

type Props = {
  children: ReactNode
}

//Initialize onboarding
initOnboard()
const setCSSStyles = () => {
  const style = document.createElement('style')

  style.innerHTML = ModalCSS

  const onboardV2 = document.querySelector('onboard-v2')

  if (onboardV2 && onboardV2.shadowRoot) {
    onboardV2.shadowRoot.appendChild(style)
  }
}

export default function Web3ConnectionProvider({ children }: Props) {
  const [{ connecting: connectingWallet, wallet }, connect, disconnect] = useConnectWallet()
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const connectedWallets = useWallets()

  const [appChainId, setAppChainId] = useState(chainIds[0])

  // Expose address, addresses, chain, chainId, connector, isConnected, isConnecting, isDisconnected, isReconnecting, status
  const { address, chainId: walletChainId } = useAccount({ config })

  const web3Provider =
    wallet?.provider != null
      ? createWalletClient({
          chain: getNetworkConfig(mapId2Name[appChainId]),
          transport: custom(wallet.provider),
        })
      : null

  const isWalletConnected = web3Provider != null && address != null

  const isAppConnected = isWalletConnected && walletChainId === appChainId

  const isWalletNetworkSupported = chains.some(({ id }) => id === connectedChain?.id)

  useEffect(() => {
    if (isWalletNetworkSupported && walletChainId) {
      setAppChainId(walletChainId as SetStateAction<ChainIds>)
    }
  }, [walletChainId, isWalletNetworkSupported])

  // Save connected wallets to localstorage
  useEffect(() => {
    if (!connectedWallets.length) return

    const connectedWalletsLabelArray = connectedWallets.map(({ label }) => label)
    setLocalStorageKey(STORAGE_CONNECTED_WALLET, connectedWalletsLabelArray)
  }, [connectedWallets, wallet])

  // Auto connect wallet if localStorage has values
  useEffect(() => {
    const previouslyConnectedWallets = recoverLocalStorageKey(STORAGE_CONNECTED_WALLET, [])
    if (previouslyConnectedWallets?.length && !connectedWallets.length) {
      const setWalletFromLocalStorage = async () =>
        await connect({
          autoSelect: { label: previouslyConnectedWallets[0], disableModals: true },
        })

      setWalletFromLocalStorage()
    }
  }, [connect, chains, connectedWallets.length])

  const getExplorerUrl = useMemo(() => {
    const url = chainsConfig[mapId2Name[appChainId]]?.blockExplorerUrls[0]
    return (hash: string) => {
      const type = hash.length > 42 ? 'tx' : 'address'
      return `${url}/${type}/${hash}`
    }
  }, [appChainId])

  const handleDisconnectWallet = async () => {
    if (wallet) {
      removeLocalStorageKey(STORAGE_CONNECTED_WALLET)
      disconnect(wallet)
    }
  }

  const handleConnectWallet = async () => {
    if (window.onboard) {
      connect()
    }
  }

  setCSSStyles()

  const value = {
    address,
    appChainId,
    chainId: walletChainId,
    connectWallet: handleConnectWallet,
    connectedChain,
    connectingWallet,
    disconnectWallet: handleDisconnectWallet,
    getExplorerUrl,
    isAppConnected,
    isOnboardChangingChain: settingChain,
    isWalletConnected,
    isWalletNetworkSupported,
    pushNetwork: setChain,
    setAppChainId,
    settingChain,
  }

  return <Web3ContextConnection.Provider value={value}>{children}</Web3ContextConnection.Provider>
}

export function useWeb3Connection() {
  const context = useContext(Web3ContextConnection)
  if (context === undefined) {
    throw new Error('useWeb3Connection must be used within a Web3ConnectionProvider')
  }
  return context
}

export function useWeb3ConnectedApp() {
  const context = useWeb3Connection()
  if (!context.isAppConnected) {
    throw new Error('useWeb3ConnectedApp must be used within a connected context')
  }
  return context as Web3Connected
}
