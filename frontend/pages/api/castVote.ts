import type { NextApiRequest, NextApiResponse } from 'next'

import { SemaphoreProof } from '@semaphore-protocol/proof'
import { Address, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { optimism } from 'viem/chains'

import { contracts } from '@/src/contracts/contracts'

type ResponseData =
  | {
      hash: string
    }
  | { message: string }

type Req = NextApiRequest & {
  body: {
    vote: number
    semaphoreProof: SemaphoreProof
  }
}

const { PK_RELAYER } = process.env

export default async function handler(
  { body: { semaphoreProof, vote } }: Req,
  res: NextApiResponse<ResponseData>,
) {
  if (!PK_RELAYER) {
    return res.status(500).json({ message: 'PK not defined' })
  }
  const { externalNullifier, nullifierHash, proof } = semaphoreProof

  const anonVoting = {
    address: contracts['AnonVoting']['address']['OP Mainnet'] as Address,
    abi: contracts['AnonVoting'].abi,
  } as const

  const signal = BigInt(vote)
  console.log({ externalNullifier, nullifierHash, proof, signal })

  const account = privateKeyToAccount(`0x${PK_RELAYER}`)

  const client = createWalletClient({
    account,
    chain: optimism,
    transport: http(),
  })

  try {
    const hash = await client.writeContract({
      ...anonVoting,
      functionName: 'castVote',
      args: [signal, nullifierHash, externalNullifier, proof],
    })
    return res.status(200).json({ hash })
  } catch (e) {
    return res.status(403).json({ message: `Error writing the contract ${e}` })
  }
}
