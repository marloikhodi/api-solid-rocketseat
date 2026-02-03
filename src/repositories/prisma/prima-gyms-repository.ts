import type { Gym, Prisma } from 'generated/prisma/client.js'
import { prisma } from '@/lib/prisma.js'
import type {
	FindManyNearbyParams,
	GymsRepository,
} from '../gyms-repository.js'

export class PrismaGymsRepository implements GymsRepository {
	async findById(id: string) {
		const gym = await prisma.gym.findUnique({
			where: {
				id,
			},
		})

		return gym
	}

	async findManyNearby(params: FindManyNearbyParams) {
		const gyms = await prisma.$queryRaw<Gym[]>`
        SELECT * from gyms
        WHERE ( 6371 * acos( cos( radians(${params.latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${params.longitude}) ) + sin( radians(${params.latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
        `
		return gyms
	}

	async searchMany(query: string, page: number) {
		const gyms = await prisma.gym.findMany({
			where: {
				title: { contains: query },
			},
			take: 20,
			skip: (page - 1) * 20,
		})

		return gyms
	}
	async create(data: Prisma.GymCreateInput) {
		const gym = await prisma.gym.create({
			data,
		})

		return gym
	}
}
