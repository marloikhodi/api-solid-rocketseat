import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt.js'
import { authenticate } from './authenticate.js'
import { profile } from './profile.js'
import { register } from './register.js'

export async function usersRoutes(app: FastifyInstance) {
	app.post('/users', register)
	app.post('/sessions', authenticate)

	// Authenticated
	app.get('/me', { onRequest: [verifyJWT] }, profile)
}
