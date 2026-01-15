import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { AuthenticateUseCase } from '@/services/authenticate.js'
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error.js'

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const authenticateBodySchema = z.object({
		email: z.email(),
		password: z.string().min(8),
	})

	const { email, password } = authenticateBodySchema.parse(request.body)

	try {
		const usersRepository = new PrismaUsersRepository()
		const authenticateUseCase = new AuthenticateUseCase(usersRepository)

		await authenticateUseCase.execute({
			email,
			password,
		})
	} catch (err) {
		if (err instanceof InvalidCredentialsError) {
			reply.status(400).send({ message: err.message })
		}

		throw err
	}

	return reply.status(200).send()
}
