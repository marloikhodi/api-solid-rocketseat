import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'

describe('register (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})
	afterAll(async () => {
		await app.close()
	})

	it('should be able to register', async () => {
		const data = {
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '12345678',
		}

		const response = await request(app.server).post('/users').send(data)

		expect(response.statusCode).toEqual(201)
	})
})
