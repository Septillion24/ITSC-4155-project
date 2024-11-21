import { describe, it, expect } from 'vitest';
import ExerciseRepo from './classes/ExcerciseRepo';
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

// describe('name', () => {
// 	it('does', async () => {
//
//	});
//});
