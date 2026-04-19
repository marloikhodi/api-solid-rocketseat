import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt.js'
import { authenticate } from './authenticate.js'
import { profile } from './profile.js'
import { refresh } from './refresh.js'
import { register } from './register.js'

export async function usersRoutes(app: FastifyInstance) {
	app.post('/users', register)
	app.post('/sessions', authenticate)

	app.patch('/token/refresh', refresh)

	// Authenticated
	app.get('/me', { onRequest: [verifyJWT] }, profile)
}
