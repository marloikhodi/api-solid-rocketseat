import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt.js'

export async function checkInsRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJWT)
}
