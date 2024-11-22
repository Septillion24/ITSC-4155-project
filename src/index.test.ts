import { describe, it, expect } from 'vitest';
import ExerciseRepo from './classes/ExcerciseRepo';
import ExerciseStatRepo from './classes/ExerciseStatRepo';
import UserWorkoutRepo from './classes/UserWorkoutRepo';
import PredefinedWorkoutRepo from './classes/PredefinedWorkoutRepo';
import WorkoutStatRepo from './classes/WorkoutStatRepo';
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
		expect(exerciseStat.reps).toBe(2);
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
});
describe('predefined workouts', () => {
	it('gets all', async () => {
		const workouts = await PredefinedWorkoutRepo.getWorkouts();
		console.log(workouts);
		expect(workouts.length).toBe(9);
	});
});

describe('workout stats', () => {
	it('adds', async () => {
		const workoutStat = await WorkoutStatRepo.addWorkoutStat(1, '15', new Date());
		expect(workoutStat.workoutID).toBe(1);
		expect(workoutStat.userID).toBe('15');
	});
	it('gets', async () => {
		const workoutStat = await WorkoutStatRepo.getWorkoutStatById(1);
		expect(workoutStat?.id).toBe(1);
		expect(workoutStat?.workoutID).toBe(2);
		expect(workoutStat?.userID).toBe('15');
	});
	it('updates', async () => {
		const workoutStat = await WorkoutStatRepo.updateWorkoutStat(1, {
			workoutID: 2,
			userID: '14',
			date: new Date()
		});
		expect(workoutStat?.id).toBe(1);
		expect(workoutStat?.workoutID).toBe(2);
		expect(workoutStat?.userID).toBe('14');
	});
	it('updates', async () => {
		const workoutStat = await WorkoutStatRepo.updateWorkoutStat(1, {
			workoutID: 2
		});
		expect(workoutStat?.id).toBe(1);
		expect(workoutStat?.workoutID).toBe(2);
		expect(workoutStat?.userID).toBe('14');
	});
	it('updates', async () => {
		const workoutStat = await WorkoutStatRepo.updateWorkoutStat(1, {
			userID: '15'
		});
		expect(workoutStat?.id).toBe(1);
		expect(workoutStat?.workoutID).toBe(2);
		expect(workoutStat?.userID).toBe('15');
	});
	it('updates', async () => {
		const workoutStat = await WorkoutStatRepo.updateWorkoutStat(1, {
			date: new Date()
		});
		expect(workoutStat?.id).toBe(1);
		expect(workoutStat?.workoutID).toBe(2);
		expect(workoutStat?.userID).toBe('15');
	});
	it('updates', async () => {
		const workoutStat = await WorkoutStatRepo.updateWorkoutStat(1, {});
		expect(workoutStat).toBe(null);
	});
});

// describe('name', () => {
// 	it('does', async () => {
//
//	});
//});
