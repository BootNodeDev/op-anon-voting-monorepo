import { useCallback, useEffect, useState } from 'react'

import { Identity } from '@semaphore-protocol/identity'
import { useSignMessage } from 'wagmi'

import { MESSAGE_TO_SIGN } from '../constants/common'

import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const BaseState = { identity: null, state: 'idle', publicIdentity: undefined }

type useIdentityStateType =
  | typeof BaseState
  | { identity: null; state: 'loading'; publicIdentity: undefined }
  | { identity: Identity; state: 'idle'; publicIdentity: bigint }
  | { identity: null; state: 'error'; publicIdentity: undefined }

type useIdentityReturnType = useIdentityStateType & {
  createIdentity: (message?: string) => Promise<void>
}
export const useIdentity = (): useIdentityReturnType => {
  const { address } = useWeb3Connection()

  const { signMessage } = useSignMessage()
  const [identity, setIdentity] = useState<useIdentityStateType>(BaseState)

  // When address changes, the identity is reset to null
  useEffect(() => {
    setIdentity(BaseState)
  }, [address])

  const createIdentity = useCallback(
    async (message = MESSAGE_TO_SIGN) => {
      setIdentity({ identity: null, state: 'loading', publicIdentity: undefined })
      try {
        await signMessage(
          { account: address, message },
          {
            onSuccess: (data) => {
              const id = new Identity(data.toString())
              setIdentity({ identity: id, state: 'idle', publicIdentity: id.getCommitment() })
            },
            onError: (error) => {
              console.error(error)
              setIdentity({ identity: null, state: 'error', publicIdentity: undefined })
            },
          },
        )
      } catch (e) {
        console.error(e)
        setIdentity({ identity: null, state: 'error', publicIdentity: undefined })
      }
    },
    [address, signMessage],
  )

  return { ...identity, createIdentity }
}
