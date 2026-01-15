import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { ResourceNotFoundError } from './errors/resource-not-found.js'
import { GetUserProfileUseCase } from './get-user-profile.js'

let usersRepository: InMemoryUserRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUserRepository()
		sut = new GetUserProfileUseCase(usersRepository)
	})
	it('should be able to get user profile', async () => {
		const createdUser = await usersRepository.create({
			email: 'johndoe@email.com',
			name: 'John Doe',
			password_hash: await hash('12345678', 6),
		})

		const { user } = await sut.execute({
			userId: createdUser.id,
		})

		expect(user.id).toEqual(expect.any(String))
		expect(user.name).toEqual('John Doe')
	})

	it('should not be able to get user profile with wrong id', async () => {
		await expect(() =>
			sut.execute({
				userId: 'non-existing-id',
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})
