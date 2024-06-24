import { useQuery } from '@apollo/client'

import { EasAttesterQuery } from '../queries/eas'

type Props = {
  schemaId: string
  recipient: string
}

export const useUidEAS = ({ recipient, schemaId }: Props) =>
  useQuery(EasAttesterQuery, {
    variables: {
      schemaId: { equals: schemaId },
      recipient: { equals: recipient },
    },
  })
