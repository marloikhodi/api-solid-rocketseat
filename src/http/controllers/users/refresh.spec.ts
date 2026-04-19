import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'

describe('Refresh Token (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})
	afterAll(async () => {
		await app.close()
	})

	it('should be able to refresh a token', async () => {
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

		const authResponse = await request(app.server).post('/sessions').send(data)

		const cookies = authResponse.get('Set-Cookie')

		if (!cookies) {
			throw new Error()
		}

		const response = await request(app.server)
			.patch('/token/refresh')
			.set('Cookie', cookies)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String),
		})
		expect(response.get('Set-Cookie')).toEqual([
			expect.stringContaining('refreshToken='),
		])
	})
})
