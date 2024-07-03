import { Maybe } from 'graphql/jsutils/Maybe'

import { IdentityWrapper } from './Poll'

import { Identity } from '@/src/components/common/Identity'

type UserIdProps = {
  createIdentity: () => Promise<void>
  loading: boolean
  publicIdentity: bigint | undefined
  uid: Maybe<`0x${string}`>
}
export const UserId = ({ createIdentity, loading, publicIdentity, uid }: UserIdProps) => {
  return (
    <IdentityWrapper>
      {loading && <p>loading sign identity</p>}
      <Identity
        identity={publicIdentity ? publicIdentity.toString() : null}
        message="Your identity is:"
        onGenerate={() => createIdentity()}
      />
      {uid && (
        <Identity
          identity={uid}
          message="Your attestation id is:"
          onGenerate={() => createIdentity()}
        />
      )}
    </IdentityWrapper>
  )
}
