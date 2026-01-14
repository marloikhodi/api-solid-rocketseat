import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { RegisterUseCase } from '@/services/register.js'

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.email(),
		password: z.string().min(8),
	})

	const { name, email, password } = registerBodySchema.parse(request.body)

	try {
		const usersRepository = new PrismaUsersRepository()
		const registerUseCase = new RegisterUseCase(usersRepository)

		await registerUseCase.execute({
			name,
			email,
			password,
		})
	} catch (err) {
		reply.status(409).send(err)
	}

	return reply.status(201).send()
}
