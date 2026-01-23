import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms.js'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch nearby gyms Use Case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new FetchNearbyGymsUseCase(gymsRepository)
	})

	it('should be able to fetch for nearby gyms', async () => {
		await gymsRepository.create({
			title: 'Near Gym',
			description: null,
			phone: null,
			latitude: -23.6027904,
			longitude: -46.7664896,
		})
		await gymsRepository.create({
			title: 'Far Gym',
			description: null,
			phone: null,
			latitude: -23.5564005,
			longitude: -46.5962523,
		})

		const { gyms } = await sut.execute({
			userLatitude: -23.6027904,
			userLongitude: -46.7664896,
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
	})
})
