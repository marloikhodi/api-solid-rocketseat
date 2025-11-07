import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
	NODE_ENV: z.enum(['dev', 'test', 'prod']).default('dev'),
	PORT: z.coerce.number().default(3333),
})

const envSafeParse = envSchema.safeParse(process.env)

if (!envSafeParse.success) {
	throw envSafeParse.error
}

export const env = envSafeParse.data
