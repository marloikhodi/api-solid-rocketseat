import { PrismaGymsRepository } from '@/repositories/prisma/prima-gyms-repository.js'
import { CreateGymUseCase } from '../create-gym.js'

export function makeCreateGymsUseCase() {
	const gymsRepository = new PrismaGymsRepository()
	const useCase = new CreateGymUseCase(gymsRepository)

	return useCase
}
