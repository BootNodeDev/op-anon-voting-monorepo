import { gql } from '@/types/generated/gql'

export const EasAttesterQuery = gql(`
  query ExampleQuery($schemaId: StringFilter, $recipient: StringFilter) {
    attestations(where: { schemaId: $schemaId, recipient: $recipient }) {
      id
      recipient
      attester
    }
  }
`)
