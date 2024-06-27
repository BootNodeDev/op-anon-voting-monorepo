import { useCallback } from 'react'

import { Client } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { usePublicClient } from 'wagmi'

import { ContractTransaction } from '@/src/components/buttons/ContractTransaction'
import { useTransactionNotification } from '@/src/providers/TransactionNotificationProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { TransactionError } from '@/src/utils/TransactionError'

export default function useTransaction() {
  const { isAppConnected } = useWeb3Connection()
  const {
    notifyRejectSignature,
    notifyTxMined,
    notifyWaitingForSignature,
    notifyWaitingForTxMined,
  } = useTransactionNotification()

  const client: Client = usePublicClient()

  const waitForTxExecution = useCallback(
    (hash: `0x${string}`) => {
      notifyWaitingForTxMined(hash)
      waitForTransactionReceipt(client, { hash })
        .then((r) => notifyTxMined(r.transactionHash, true))
        .catch((e) => {
          const error = new TransactionError(
            e.data?.message || e.message || 'Unable to decode revert reason',
            e.data?.code || e.code,
            e.data,
          )

          console.error(error)

          notifyTxMined(hash)
        })
    },
    [client, notifyTxMined, notifyWaitingForTxMined],
  )

  return useCallback(
    async (methodToCall: () => Promise<ContractTransaction>) => {
      if (!isAppConnected) {
        throw Error('App is not connected')
      }
      try {
        notifyWaitingForSignature()
        const hash = await methodToCall()
        if (hash) waitForTxExecution(hash)
        return hash
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        // TODO Should we check for `status`?
        console.error(e)
        const error = new TransactionError(
          e.data?.message || e.message || 'Unable to decode revert reason',
          e.data?.code || e.code,
          e.data,
        )

        notifyRejectSignature(error.code === 4001 ? 'User denied signature' : error.message)
        throw error
      }
    },
    [isAppConnected, notifyWaitingForSignature, waitForTxExecution, notifyRejectSignature],
  )
}
