import { describe, it, expect } from 'vitest';
import WorkoutRepo from '../src/classes/WorkoutRepo';
import Workout from '../src/classes/Workout';

describe('WorkoutRepo Tests', () => {
	let workout: Workout;
	it('should add and retrieve a workout successfully', async () => {
		workout = await WorkoutRepo.addWorkout('workout1', [1, 2, 3]);
		expect(WorkoutRepo.getWorkoutById(workout.workoutId)).toEqual(workout);
	});
	it('should retrieve a workout by name', async () => {
		expect(WorkoutRepo.getWorkoutByName('workout1')).toEqual(workout);
	});
	it('should update a workout by id', () => {
		workout.setExerciseList([4, 5, 6]);
		WorkoutRepo.updateWorkout(workout.workoutId, { exerciseList: workout.exerciseList });
		expect(WorkoutRepo.getWorkoutById(workout.workoutId)).toEqual(workout);
	});
	it('should delete a workout by id', async () => {
		WorkoutRepo.deleteWorkout(workout.workoutId);
		expect(WorkoutRepo.getWorkoutById(workout.workoutId)).toBeUndefined();
	});
});
