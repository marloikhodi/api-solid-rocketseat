import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.js'
import { RegisterUseCase } from './register.js'

describe('Register Use Case', () => {
	it('should hash user password upon registration', async () => {
		const usersRepository = new InMemoryUserRepository()
		const registerUseCase = new RegisterUseCase(usersRepository)

		const { user } = await registerUseCase.execute({
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
		const usersRepository = new InMemoryUserRepository()
		const registerUseCase = new RegisterUseCase(usersRepository)

		const email = 'johndoe@email.com'

		await registerUseCase.execute({
			name: 'John Doe',
			email: email,
			password: '12345678',
		})

		await expect(() =>
			registerUseCase.execute({
				name: 'John Doe',
				email: email,
				password: '12345678',
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})

	it('should be able to register', async () => {
		const usersRepository = new InMemoryUserRepository()
		const registerUseCase = new RegisterUseCase(usersRepository)

		const { user } = await registerUseCase.execute({
			name: 'John Doe',
			email: 'johndoe@email.com',
			password: '12345678',
		})

		expect(user.id).toEqual(expect.any(String))
	})
})
