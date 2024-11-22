import { describe, it, expect } from 'vitest';
import ExerciseRepo from './classes/ExcerciseRepo';
import ExerciseStatRepo from './classes/ExerciseStatRepo';
import UserWorkoutRepo from './classes/UserWorkoutRepo';
import PredefinedWorkoutRepo from './classes/PredefinedWorkoutRepo';
describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});

describe('exercise tests', () => {
	//finished
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
	it('gets user workout by id', async () => {
		const exercise = await UserWorkoutRepo.getUserWorkoutById(3);
		console.log(exercise);
		expect(exercise?.id).toBe(3);
		expect(exercise?.name).toBe('jorn');
		expect(exercise?.exerciseList).toEqual([]);
		expect(exercise?.userID).toBe('15');
	});
	it('updates', async () => {
		const workout = await UserWorkoutRepo.updateWorkout(3, {
			name: 'sadsaddsa',
			exerciseList: [1, 2, 3],
			userID: '14'
		});
		expect(workout?.id).toBe(3);
		expect(workout?.name).toBe('sadsaddsa');
		expect(workout?.exerciseList).toEqual([1, 2, 3]);
		expect(workout?.userID).toBe('14');
	});
	it('updates', async () => {
		const workout = await UserWorkoutRepo.updateWorkout(3, {
			exerciseList: [1, 2, 5]
		});
		expect(workout?.id).toBe(3);
		expect(workout?.name).toBe('sadsaddsa');
		expect(workout?.exerciseList).toEqual([1, 2, 5]);
		expect(workout?.userID).toBe('14');
	});
	it('updates', async () => {
		const workout = await UserWorkoutRepo.updateWorkout(3, {
			userID: '15'
		});
		expect(workout?.id).toBe(3);
		expect(workout?.name).toBe('sadsaddsa');
		expect(workout?.exerciseList).toEqual([1, 2, 5]);
		expect(workout?.userID).toBe('15');
	});
	it('updates', async () => {
		const workout = await UserWorkoutRepo.updateWorkout(3, {
			name: 'jorn'
		});
		expect(workout?.id).toBe(3);
		expect(workout?.name).toBe('jorn');
		expect(workout?.exerciseList).toEqual([1, 2, 5]);
		expect(workout?.userID).toBe('15');
	});
	it('updates', async () => {
		const workout = await UserWorkoutRepo.updateWorkout(3, {
			name: undefined
		});
		expect(workout).toBe(null);
	});
	it('updates', async () => {
		let workout = await UserWorkoutRepo.updateWorkout(3, {
			exerciseList: [1, 2, 3]
		});
		workout = await UserWorkoutRepo.updateWorkout(3, {
			exerciseList: []
		});
		expect(workout?.exerciseList).toEqual([]);
	});
	//let addedID: number;
	// it('adds', async () => {
	// 	const workout = await UserWorkoutRepo.addWorkout('jawn', [1, 2, 3], '14');
	// 	expect(workout.name).toBe('jawn');
	// 	expect(workout.exerciseList).toEqual([1, 2, 3]);
	// 	expect(workout.userID).toBe('14');
	// 	workout.id = addedID;
	// });
	// it('deletes', async () => {
	// 	const workout = await UserWorkoutRepo.deleteWorkout(addedID);
	// 	expect(workout).toBe(true);
	// });
});
describe('predefined workouts', () => {
	it('gets all', async () => {
		const workouts = await PredefinedWorkoutRepo.getWorkouts();
		console.log(workouts);
		expect(workouts.length).toBe(9);
	});
});

// describe('name', () => {
// 	it('does', async () => {
//
//	});
//});
