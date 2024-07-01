import type { DetailedHTMLProps, HTMLAttributes } from 'react'

export type ObjectValues<T> = T[keyof T]

export type Maybe<T> = T | null
export type RequiredNonNull<T> = { [P in keyof T]-?: NonNullable<T[P]> }

export type RPCProviders = 'infura' | 'alchemy'

export const RPCProvidersENV: Record<RPCProviders, string | undefined> = {
  infura: process.env.NEXT_PUBLIC_INFURA_TOKEN,
  alchemy: process.env.NEXT_PUBLIC_ALCHEMY_TOKEN,
}
export type IntrinsicElements<H extends HTMLElement = HTMLElement> = DetailedHTMLProps<
  HTMLAttributes<H>,
  H
>

export const isFulfilled = <T>(
  input: PromiseSettledResult<T>,
): input is PromiseFulfilledResult<T> => input.status === 'fulfilled'
