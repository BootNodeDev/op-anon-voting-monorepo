import { useCallback } from 'react'

import { Identity } from '@semaphore-protocol/identity'
import { useSignMessage } from 'wagmi'

import { useWeb3Connection } from '../providers/web3ConnectionProvider'

export const useIdentity = () => {
  const { address } = useWeb3Connection()
  const { signMessage } = useSignMessage()

  const createIdentity = useCallback(async () => {
    signMessage(
      { account: address, message: 'asd' },
      {
        onSuccess: (data) => {
          console.log(data)
          const identity = new Identity(data.toString())
          console.log(identity)
        },
      },
    )
  }, [address, signMessage])
  // const tx = useTransaction()

  return { createIdentity }
}
