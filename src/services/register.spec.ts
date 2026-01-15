import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.js'
import { RegisterUseCase } from './register.js'

let usersRepository: InMemoryUserRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUserRepository()
		sut = new RegisterUseCase(usersRepository)
	})

	it('should be able to register', async () => {
		const { user } = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@email.com',
			password: '12345678',
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should hash user password upon registration', async () => {
		const { user } = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@email.com',
			password: '12345678',
		})

		const isPasswordCorrectlyHashed = await compare(
			'12345678',
			user.password_hash,
		)

		expect(isPasswordCorrectlyHashed).toBe(true)
	})

	it('should not be able to register the same e-mail twice', async () => {
		const email = 'johndoe@email.com'

		await sut.execute({
			name: 'John Doe',
			email: email,
			password: '12345678',
		})

		await expect(() =>
			sut.execute({
				name: 'John Doe',
				email: email,
				password: '12345678',
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})
