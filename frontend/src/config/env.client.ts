'use client'

import { z } from 'zod'

import { chainIdsArray } from './wagmi'

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('BootNode'),
  NEXT_PUBLIC_DEFAULT_THEME: z.enum(['light', 'dark']).default('light'),
  NEXT_PUBLIC_INFURA_TOKEN: z.string().length(32, 'Invalid infura token').optional(),
  NEXT_PUBLIC_ALCHEMY_TOKEN: z.string().length(32, 'Invalid alchemy token').optional(),
  NEXT_PUBLIC_WC_PROJECT_ID: z.string().length(32, 'Invalid Wallet Connect projectId').optional(),
  NEXT_PUBLIC_WC_DAPP_URL: z.string().url().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().startsWith('G-').optional(),
  NEXT_PUBLIC_COOKIES_WARNING_ENABLED: z.enum(['true', 'false']).default('true'),
  NEXT_PUBLIC_DEFAULT_CHAIN_ID: z.enum(chainIdsArray).default(chainIdsArray[0]),
  NEXT_PUBLIC_SUBGRAPH_URI: z.string().url(),
})

export const env = envSchema.parse(process.env)

export default env
