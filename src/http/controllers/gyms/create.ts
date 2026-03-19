import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateGymsUseCase } from '@/services/factories/make-create-gym-use-case.js'

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createGymBodySchema = z.object({
		title: z.string(),
		description: z.email().nullable(),
		phone: z.string().nullable(),
		latitude: z.number().refine((value) => {
			return Math.abs(value) <= 90
		}),
		longitude: z.number().refine((value) => {
			return Math.abs(value) <= 180
		}),
	})

	const { title, description, phone, latitude, longitude } =
		createGymBodySchema.parse(request.body)

	const createGymUseCase = makeCreateGymsUseCase()

	await createGymUseCase.execute({
		title,
		description,
		phone,
		latitude,
		longitude,
	})

	return reply.status(201).send()
}
