import { useEffect, useState } from 'react'

import { useQuery } from '@apollo/client'
import { Maybe } from 'graphql/jsutils/Maybe'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

import { EasAttesterQuery } from '@/src/queries/eas'

type Props = {
  schemaId?: string
  recipient?: Address
}

export const useUID = ({ recipient, schemaId }: Props) =>
  useQuery(EasAttesterQuery, {
    variables: {
      schemaId: { equals: schemaId },
      recipient: { equals: recipient },
    },
    skip: schemaId === undefined || recipient === undefined,
  })

export const useUserAttestation = () => {
  const { address } = useAccount()
  const [uid, setUid] = useState<Maybe<Address>>(null)

  const {
    data: easSubgraphData,
    error,
    loading,
  } = useUID({
    recipient: address,
    schemaId: process.env.NEXT_PUBLIC_EAS_SCHEMA,
  })

  useEffect(() => {
    const att = easSubgraphData?.attestations[0]

    const isAttested = att && att.id && att.recipient === address

    setUid(isAttested ? (att.id as Address) : null)
  }, [address, easSubgraphData?.attestations])

  return { uid, isAttested: uid !== null, loading, error }
}
