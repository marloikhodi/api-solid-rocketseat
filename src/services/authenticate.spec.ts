import { hash } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { AuthenticateUseCase } from './authenticate.js'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.js'

describe('Authenticate Use Case', () => {
	it('should be able to authenticate', async () => {
		const usersRepository = new InMemoryUserRepository()
		const sut = new AuthenticateUseCase(usersRepository)

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
		const usersRepository = new InMemoryUserRepository()
		const sut = new AuthenticateUseCase(usersRepository)

		await expect(() =>
			sut.execute({
				email: 'johndoe@email.com',
				password: '12345678',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not be able to authenticate with wrong password', async () => {
		const usersRepository = new InMemoryUserRepository()
		const sut = new AuthenticateUseCase(usersRepository)

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
