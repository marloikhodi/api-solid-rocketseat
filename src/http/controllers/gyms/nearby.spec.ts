import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.js'

describe('Nearby Gym (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to search nearby gyms', async () => {
		const { token } = await createAndAuthenticateUser(app, true)

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'JavaScript Gym',
				description: null,
				phone: null,
				latitude: -23.6027904,
				longitude: -46.7664896,
			})

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'TypeScript Gym',
				description: null,
				phone: null,
				latitude: -23.5564005,
				longitude: -46.5962523,
			})

		const response = await request(app.server)
			.get('/gyms/nearby')
			.query({
				latitude: -23.6027904,
				longitude: -46.7664896,
			})
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms).toEqual([
			expect.objectContaining({ title: 'JavaScript Gym' }),
		])
	})
})
