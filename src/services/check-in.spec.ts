import { Decimal } from '@prisma/client/runtime/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { CheckInUseCase } from './check-in.js'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check Ins Use Case', () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		sut = new CheckInUseCase(checkInsRepository, gymsRepository)

		gymsRepository.items.push({
			id: 'gym-01',
			description: '',
			latitude: new Decimal(0),
			longitude: new Decimal(0),
			phone: '',
			title: '',
		})

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to check in', async () => {
		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: 0,
			userLongitude: 0,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in twice on the same day', async () => {
		vi.setSystemTime(new Date(2024, 0, 15, 11, 0, 0))

		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: 0,
			userLongitude: 0,
		})

		await expect(() =>
			sut.execute({
				gymId: 'gym-01',
				userId: 'user-01',
				userLatitude: 0,
				userLongitude: 0,
			}),
		).rejects.toBeInstanceOf(Error)
	})

	it('should be able to check in twice in different days', async () => {
		vi.setSystemTime(new Date(2024, 0, 15, 11, 0, 0))

		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: 0,
			userLongitude: 0,
		})

		vi.setSystemTime(new Date(2024, 0, 16, 11, 0, 0))

		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: 0,
			userLongitude: 0,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in on a distant gym', async () => {
		gymsRepository.items.push({
			id: 'gym-02',
			description: '',
			latitude: new Decimal(-23.5732932),
			longitude: new Decimal(-46.7094122),
			phone: '',
			title: '',
		})

		await expect(() =>
			sut.execute({
				gymId: 'gym-01',
				userId: 'user-01',
				userLatitude: -23.6027904,
				userLongitude: -46.7664896,
			}),
		).rejects.toBeInstanceOf(Error)
	})
})
