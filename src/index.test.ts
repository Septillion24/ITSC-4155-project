import { describe, it, expect } from 'vitest';
import ExerciseRepo from './classes/ExcerciseRepo';
import ExerciseStatRepo from './classes/ExerciseStatRepo';
import { DateTime } from '@auth/core/providers/kakao';
describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});

describe('exercise tests', () => {
	it('gets excercise by id', async () => {
		const exercise = await ExerciseRepo.getExerciseByid(13);
		expect(exercise?.name).toBe('Lat Pulldown');
	});
	it('gets all excercises', async () => {
		const exercises = await ExerciseRepo.getExercises();
		expect(exercises.length).toBe(41);
	});
});

describe('exercise stats tests', () => {
	it('getExerciseStatsByUser', async () => {
		const exerciseStats = await ExerciseStatRepo.getExerciseStatsByUser('111825907751830022492');
		expect(exerciseStats[0].id).toBe(2);
	});
	it('addExerciseStat', async () => {
		const dateInstance = new Date();
		const exerciseStatInfo = {
			exerciseID: 13,
			userID: '111825907751830022492',
			date: dateInstance,
			sets: 3,
			reps: 8,
			weight: [135, 145, 155]
		};
		const exerciseStat = await ExerciseStatRepo.addExerciseStat(exerciseStatInfo);
		expect(exerciseStat.reps).toBe(8);
	});
});

describe('user workouts', () => {
	it('gets userworout by id', async () => {
		const exercise = await ExerciseRepo.getExerciseByid(13);
		expect(exercise?.name).toBe('Lat Pulldown');
	});
	it('gets all excercises', async () => {
		const exercises = await ExerciseRepo.getExercises();
		expect(exercises.length).toBe(41);
	});
});

// describe('name', () => {
// 	it('does', async () => {
//
//	});
//});
