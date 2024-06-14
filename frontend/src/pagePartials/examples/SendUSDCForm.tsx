import React, { useState } from 'react'
import styled, { css } from 'styled-components'

import { Address, isAddress } from 'viem'
import { useReadContracts, useWriteContract } from 'wagmi'

import TxButton from '@/src/components/buttons/TxButton'
import { Formfield } from '@/src/components/form/Formfield'
import { Textfield as BaseTextfield, TextfieldStatus } from '@/src/components/form/Textfield'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { TokenInput as BaseTokenInput } from '@/src/components/token/TokenInput'
import { ChainIds, mapId2Name } from '@/src/config/wagmi'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/bigNumber'
import ERC20Abi from '@/src/contracts/abis/ERC20.abi'
import { contracts } from '@/src/contracts/contracts'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

const CSSMaxWidth = css`
  min-width: 300px;
  max-width: 100%;
`

const TokenInput = styled(BaseTokenInput)`
  ${CSSMaxWidth}
`

const Textfield = styled(BaseTextfield)`
  ${CSSMaxWidth}
`

const Button = styled(TxButton)`
  margin-top: 22px;
`

const SendUSDCForm = () => {
  const { address, chainId } = useWeb3ConnectedApp()
  const [valueToSend, setValueToSend] = useState('0')
  const [addressToSend, setAddressToSend] = useState('')
  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()

  const usdc = {
    address: contracts['USDC'].address[mapId2Name[chainId as ChainIds]],
    abi: ERC20Abi,
  } as const

  const { writeContractAsync } = useWriteContract()
  const { data, refetch } = useReadContracts({
    allowFailure: false,
    contracts: [
      { ...usdc, functionName: 'balanceOf', args: [address || ZERO_ADDRESS] },
      { ...usdc, functionName: 'decimals' },
    ],
  })

  const [usdcBalance, usdcDecimals] = data || [ZERO_BN, 18]

  const clearForm = () => {
    setValueToSend('')
    setAddressToSend('')
  }

  const invalidAddress = addressToSend && !isAddress(addressToSend)
  const disableSubmit =
    !addressToSend ||
    invalidAddress ||
    tokenInputStatus === TextfieldStatus.error ||
    BigInt(valueToSend || ZERO_BN) === ZERO_BN

  return (
    <SimpleGrid alignItems="flex-start">
      <Formfield
        formControl={
          <TokenInput
            balancePosition="topRight"
            decimals={usdcDecimals}
            maxValue={usdcBalance.toString()}
            setStatus={(status: TextfieldStatus | undefined) => setTokenInputStatus(status)}
            setStatusText={(statusText: string | undefined) => setTokenInputStatusText(statusText)}
            setValue={setValueToSend}
            symbol="USDC"
            value={valueToSend}
          />
        }
        label={'Send'}
        status={tokenInputStatus}
        statusText={tokenInputStatusText}
      />
      <Formfield
        formControl={
          <Textfield
            onChange={(e) => setAddressToSend(e.target.value)}
            placeholder="ETH address..."
            value={addressToSend}
          />
        }
        label={'to'}
        status={invalidAddress ? TextfieldStatus.error : undefined}
        statusText={invalidAddress ? 'Invalid address' : undefined}
      />
      <Button
        disabled={disableSubmit}
        onMined={() => refetch()}
        onSend={(tx) => tx && clearForm()}
        tx={async () =>
          writeContractAsync({
            ...usdc,
            functionName: 'transfer',
            args: [addressToSend as Address, BigInt(valueToSend)],
          })
        }
      >
        Send
      </Button>
    </SimpleGrid>
  )
}

export default withGenericSuspense(SendUSDCForm)
