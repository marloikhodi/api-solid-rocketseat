import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { AuthenticateUseCase } from './authenticate.js'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.js'

let usersRepository: InMemoryUserRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUserRepository()
		sut = new AuthenticateUseCase(usersRepository)
	})
	it('should be able to authenticate', async () => {
		await usersRepository.create({
			email: 'johndoe@email.com',
			name: 'John Doe',
			password_hash: await hash('12345678', 6),
		})

		const { user } = await sut.execute({
			email: 'johndoe@email.com',
			password: '12345678',
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should not be able to authenticate with wrong email', async () => {
		await expect(() =>
			sut.execute({
				email: 'johndoe@email.com',
				password: '12345678',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not be able to authenticate with wrong password', async () => {
		await usersRepository.create({
			email: 'johndoe@email.com',
			name: 'John Doe',
			password_hash: await hash('12345678', 6),
		})

		await expect(() =>
			sut.execute({
				email: 'johndoe@email.com',
				password: '123123',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})
