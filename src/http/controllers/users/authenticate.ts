import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error.js'
import { makeAuthenticateUseCase } from '@/services/factories/make-authenticate-use-case.js'

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
		const authenticateUseCase = makeAuthenticateUseCase()

		const { user } = await authenticateUseCase.execute({
			email,
			password,
		})

		const token = await reply.jwtSign(
			{},
			{
				sign: {
					sub: user.id,
				},
			},
		)

		return reply.status(200).send({ token })
	} catch (err) {
		if (err instanceof InvalidCredentialsError) {
			reply.status(400).send({ message: err.message })
		}

		throw err
	}
}
