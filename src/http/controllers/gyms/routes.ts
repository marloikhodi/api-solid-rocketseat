import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt.js'
import { create } from './create.js'

export async function gymsRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJWT)

	app.post('/create', create)
}
