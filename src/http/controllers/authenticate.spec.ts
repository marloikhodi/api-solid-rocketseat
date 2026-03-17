import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'

describe('Authenticate (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})
	afterAll(async () => {
		await app.close()
	})

	it('should be able to authenticate', async () => {
		const user = {
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '12345678',
		}

		await request(app.server).post('/users').send(user)

		const data = {
			email: 'johndoe@example.com',
			password: '12345678',
		}

		const response = await request(app.server).post('/sessions').send(data)

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String),
		})
	})
})
