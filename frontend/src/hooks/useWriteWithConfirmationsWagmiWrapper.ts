import { useEffect } from 'react'

import { Abi, AbiStateMutability, Address, ContractFunctionName } from 'viem'
import { useWaitForTransactionReceipt } from 'wagmi'
import { CreateUseWriteContractReturnType } from 'wagmi/codegen'

export const useWriteWithConfirmationsWagmiWrapper = <
  TAbi extends Abi | readonly unknown[],
  TAddress extends Address,
  TFunctionName extends ContractFunctionName<TAbi, AbiStateMutability>,
>(
  hook: CreateUseWriteContractReturnType<TAbi, TAddress, TFunctionName>,
  onSuccess = () => {},
  confirmations = 1,
) => {
  const {
    data: hash,
    error: errorTx,
    isError: isErrorTx,
    isIdle: isIdleTx,
    isPending: isPendingTx,
    isSuccess: isSuccessTx,
    ...hookData
  } = hook()

  const {
    error: errorMined,
    isError: isErrorMined,
    isPending: isPendingMined,
    isSuccess: isSuccessMined,
  } = useWaitForTransactionReceipt({ hash, confirmations })

  useEffect(() => {
    if (isSuccessMined) {
      onSuccess()
    }
  }, [isSuccessMined, isSuccessTx, onSuccess])

  const isWaiting = isPendingTx ? isPendingTx : isPendingMined && isSuccessTx
  const isError = isErrorMined || isErrorTx

  return {
    hash,
    isWaiting,
    isError,
    isIdleTx,
    isPendingTx,
    isSuccessTx,
    errorTx,
    errorMined,
    isPendingMined,
    isSuccessMined,
    ...hookData,
  }
}
