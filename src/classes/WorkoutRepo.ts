import sql from '$lib/databaseConnection';
import Workout from './Workout';
export default class WorkoutRepo {
	async getWorkouts() {
		type workoutFromDatabase = {
			workout_id: number;
			name: string;
			exerciseList: number[];
		};
		const workoutsFromDatabase = await sql<workoutFromDatabase[]>`SELECT * FROM workouts`;
		return workoutsFromDatabase.map(
			(workout) => new Workout(workout.workout_id, workout.name, workout.exerciseList)
		);
	}

	async getWorkoutById(workoutId: number) {
		type workoutFromDatabase = {
			workout_id: number;
			name: string;
			exerciseList: number[];
		};
		const workoutFromDatabase = await sql<workoutFromDatabase[]>`
            SELECT * FROM workouts WHERE workout_id = ${workoutId}
        `;
		if (workoutFromDatabase.length === 0) {
			return null;
		}
		const workout = workoutFromDatabase[0];
		return new Workout(workout.workout_id, workout.name, workout.exerciseList);
	}

	async getWorkoutByName(name: string) {
		type workoutFromDatabase = {
			workout_id: number;
			name: string;
			exerciseList: number[];
		};
		const workoutFromDatabase = await sql<workoutFromDatabase[]>`
            SELECT * FROM workouts WHERE name = ${name}
        `;
		if (workoutFromDatabase.length === 0) {
			return null;
		}
		const workout = workoutFromDatabase[0];
		return new Workout(workout.workout_id, workout.name, workout.exerciseList);
	}

	async addWorkout(name: string, exerciseList: number[]) {
		const row =
			await sql`INSERT INTO workouts (name, exerciseList) VALUES (${name}, ${exerciseList}) returning workout_id`;
		const workoutID = row[0].workout_id;
		return new Workout(workoutID, name, exerciseList);
	}

	async updateWorkout(workoutId: number, updates: { name?: string; exerciseList?: number[] }) {
		if (!updates.name && !updates.exerciseList) {
			return;
		}
		await sql`UPDATE workouts SET ${sql(updates)} WHERE workout_id=${workoutId}`;
	}
	async deleteWorkout(workoutId: number) {
		await sql`DELETE FROM workouts WHERE workout_id=${workoutId}`;
	}
}
