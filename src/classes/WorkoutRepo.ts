import sql from '$lib/DatabaseConnection';
import Workout from './Workout';

export default class WorkoutRepo {
	static async getWorkouts() {
		type workoutFromDatabase = {
			workout_id: number;
			name: string;
			exercise_list: number[];
			user_id: string;
		};
		const workoutsFromDatabase = await sql<workoutFromDatabase[]>`SELECT * FROM workouts`;
		return workoutsFromDatabase.map(
			(workout) =>
				new Workout(workout.workout_id, workout.name, workout.exercise_list, workout.user_id)
		);
	}

	static async getWorkoutById(workoutID: number) {
		type workoutFromDatabase = {
			workout_id: number;
			name: string;
			exercise_list: number[];
			user_id: string;
		};
		const workoutFromDatabase = await sql<workoutFromDatabase[]>`
            SELECT * FROM workouts WHERE workout_id = ${workoutID}
        `;
		if (workoutFromDatabase.length === 0) {
			return null;
		}
		const workout = workoutFromDatabase[0];
		return new Workout(workout.workout_id, workout.name, workout.exercise_list, workout.user_id);
	}

	static async getWorkoutByName(name: string) {
		type workoutFromDatabase = {
			workout_id: number;
			name: string;
			exercise_list: number[];
		};
		const workoutFromDatabase = await sql<workoutFromDatabase[]>`
            SELECT * FROM workouts WHERE name = ${name}
        `;
		if (workoutFromDatabase.length === 0) {
			return null;
		}
		const workout = workoutFromDatabase[0];
		return new Workout(workout.workout_id, workout.name, workout.exercise_list);
	}

	static async addWorkout(name: string, exercise_list: number[], user_id: string) {
		const row =
			await sql`INSERT INTO workouts (name, exercise_list, user_id) VALUES (${name}, ${exercise_list}, ${user_id}) returning workout_id`;
		const workoutID = row[0].workout_id;
		return new Workout(workoutID, name, exercise_list, user_id);
	}

	static async updateWorkout(
		workoutId: number,
		updates: { name?: string; exercise_list?: number[]; user_id?: number }
	) {
		if (!updates.name && !updates.exercise_list && !updates.user_id) {
			return;
		}
		await sql`UPDATE workouts SET ${sql(updates)} WHERE workout_id=${workoutId}`;
		return await this.getWorkoutById(workoutId);
	}
	static async deleteWorkout(workoutId: number) {
		await sql`DELETE FROM workouts WHERE workout_id=${workoutId}`;
	}

	static async addExerciseToWorkout(workoutID: number, exerciseID: number) {
		await sql`UPDATE workouts SET exercise_list = array_append(exercise_list, ${exerciseID}) WHERE workout_id=${workoutID}`;
	}
}
