import { randomUUID } from 'node:crypto'
import type { Prisma, User } from 'generated/prisma/client.js'
import type { UsersRepository } from '../users-repository.js'

export class InMemoryUserRepository implements UsersRepository {
	public items: User[] = []

	async findById(id: string): Promise<User | null> {
		const user = this.items.find((item) => id === item.id)

		if (!user) {
			return null
		}

		return user
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = this.items.find((item) => email === item.email)

		if (!user) {
			return null
		}

		return user
	}

	async create(data: Prisma.UserCreateInput): Promise<User> {
		const user = {
			id: randomUUID(),
			name: data.name,
			email: data.email,
			password_hash: data.password_hash,
			created_at: new Date(),
		}

		this.items.push(user)

		return user
	}
}
