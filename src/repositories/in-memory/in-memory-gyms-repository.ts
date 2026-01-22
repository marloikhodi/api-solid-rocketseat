import { randomUUID } from 'node:crypto'
import { title } from 'node:process'
import { type Gym, Prisma } from 'generated/prisma/client.js'
import type { GymsRepository } from '../gyms-repository.js'

export class InMemoryGymsRepository implements GymsRepository {
	public items: Gym[] = []

	async findById(id: string): Promise<Gym | null> {
		const gym = this.items.find((item) => id === item.id)

		if (!gym) {
			return null
		}

		return gym
	}

	async create(data: Prisma.GymCreateInput): Promise<Gym> {
		const gym = {
			id: data.id ?? randomUUID(),
			title: data.title,
			description: data.description ?? null,
			phone: data.phone ?? null,
			latitude: new Prisma.Decimal(data.latitude.toString()),
			longitude: new Prisma.Decimal(data.longitude.toString()),
			created_at: new Date(),
		}

		this.items.push(gym)

		return gym
	}
}
