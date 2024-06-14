import React, { ButtonHTMLAttributes, useCallback } from 'react'

import { TransactionReceipt } from 'viem'
import { usePublicClient } from 'wagmi'

import { Button } from '@/src/components/buttons/Button'
import useTransaction from '@/src/hooks/useTransaction'
import { ContractTransaction } from '@/types/web3'

interface TxButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onMined?: (r: TransactionReceipt) => void
  onSend?: (t: ContractTransaction) => void
  onFail?: (error: unknown) => void
  tx: () => Promise<ContractTransaction>
}

const TxButton: React.FC<TxButtonProps> = ({
  children,
  onFail,
  onMined,
  onSend,
  tx,
  ...restProps
}) => {
  const sendTx = useTransaction()
  const client = usePublicClient()

  const txHandler = useCallback(async () => {
    try {
      const txHash = await sendTx(tx)
      onSend && onSend(txHash)
      if (onMined) {
        const receipt = await client.waitForTransactionReceipt({
          hash: txHash,
        })
        onMined(receipt)
      }
    } catch (error) {
      onFail && onFail(error)
    }
  }, [client, onFail, onMined, onSend, sendTx, tx])

  return (
    <Button onClick={txHandler} {...restProps}>
      {children}
    </Button>
  )
}

export default TxButton
