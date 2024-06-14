'use server'

import { z } from 'zod'

import 'dotenv/config'

const envSchema = z.object({
  ETHERSCAN_API_KEY: z.string().length(34, 'Invalid etherscan api key'), // Requires import process.env
})

const env = envSchema.parse(process.env)

export default env
