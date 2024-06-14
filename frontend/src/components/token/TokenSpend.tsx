import React, { useState } from 'react'
import styled, { css } from 'styled-components'

import { TransactionReceipt, erc20Abi } from 'viem'
import { useReadContracts, useWriteContract } from 'wagmi'

import TxButton from '@/src/components/buttons/TxButton'
import { Formfield } from '@/src/components/form/Formfield'
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { TokenInput as BaseTokenInput } from '@/src/components/token/TokenInput'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

const CSSMaxWidth = css`
  min-width: 300px;
  max-width: 100%;
`

const TokenInput = styled(BaseTokenInput)`
  ${CSSMaxWidth}
`

const Button = styled(TxButton)`
  margin-top: 22px;
`

type Props = {
  label: string
  erc20Address: `0x${string}` // ERC20 address
  spender: `0x${string}` // Spender address
  spendAction: () => Promise<TransactionReceipt> // action like deposit, withdraw, borrow, etc
  erc20Info?: {
    symbol: string
    decimals: number
  }
}

const zero = BigInt(0)

const TokenSpend = ({ erc20Address, erc20Info, label, spendAction, spender }: Props) => {
  const { address } = useWeb3ConnectedApp()
  const [value, setValue] = useState('0')

  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()

  const erc20 = {
    address: erc20Address,
    abi: erc20Abi,
  } as const

  const { writeContractAsync } = useWriteContract()
  const { data, refetch } = useReadContracts({
    allowFailure: false,
    contracts: [
      { ...erc20, functionName: 'decimals' },
      { ...erc20, functionName: 'symbol' },
      { ...erc20, functionName: 'balanceOf', args: [address] },
      { ...erc20, functionName: 'allowance', args: [address ?? '0x0', spender] }, // TODO improve narrow address to not undefined
    ],
  })

  console.log({ data, erc20Info })
  // TODO is undefined on first run. Wagmi + suspense?
  // if (!data?.length && !erc20Info) {
  //   throw Error('Impossible to get token data')
  // }

  const [decimals, symbol, balance, allowance] = data || [
    erc20Info?.decimals ?? 18,
    erc20Info?.symbol ?? 'ABC',
    zero,
    zero,
  ]

  const disableSubmit = tokenInputStatus === TextfieldStatus.error || BigInt(value) === zero

  return (
    <SimpleGrid alignItems="flex-start">
      <Formfield
        formControl={
          <TokenInput
            balancePosition="topRight"
            decimals={decimals}
            maxValue={balance.toString()}
            setStatus={setTokenInputStatus}
            setStatusText={setTokenInputStatusText}
            setValue={setValue}
            symbol={symbol}
            value={value}
          />
        }
        label={label}
        status={tokenInputStatus}
        statusText={tokenInputStatusText}
      />
      {allowance > BigInt(value) ? (
        <Button
          disabled={disableSubmit}
          onMined={() => refetch()}
          tx={async () => {
            return writeContractAsync({
              ...erc20,
              functionName: 'approve',
              args: [spender, BigInt(value)],
            })
          }}
        >
          Approve
        </Button>
      ) : (
        <Button
          disabled={disableSubmit}
          onMined={() => refetch()}
          onSend={(tx) => tx && setValue('0')}
          tx={async () => {
            const hash = await spendAction()
            return hash.transactionHash
          }}
        >
          {label}
        </Button>
      )}
    </SimpleGrid>
  )
}

export default withGenericSuspense(TokenSpend)
