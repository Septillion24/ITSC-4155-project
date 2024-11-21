import sql from '$lib/DatabaseConnection';
import type { PredefinedWorkout } from './PredefinedWorkout';
export default class UserWorkoutRepo {
	static async getPredefinedWorkout(): Promise<PredefinedWorkout[]> {
		type WorkoutFromDatabase = {
			workout_id: number;
			name: string;
			exercise_list: number[];
		};
		const workoutsFromDatabase = await sql<
			WorkoutFromDatabase[]
		>`SELECT * FROM predefined_workouts`;
		if (workoutsFromDatabase.length === 0) {
			return [];
		}
		return workoutsFromDatabase.map((workout) => ({
			id: workout.workout_id,
			name: workout.name,
			exerciseList: workout.exercise_list
		}));
	}

	static async getPredefinedWorkoutById(workoutID: number): Promise<PredefinedWorkout | null> {
		type PredefinedWorkoutFromDatabase = {
			workout_id: number;
			name: string;
			exercise_list: number[];
		};
		const workoutsFromDatabase = await sql<PredefinedWorkoutFromDatabase[]>`
            SELECT * FROM user_workouts WHERE workout_id = ${workoutID}
        `;
		if (workoutsFromDatabase.length === 0) {
			return null;
		}
		const workout = workoutsFromDatabase[0];
		return {
			id: workout.workout_id,
			name: workout.name,
			exerciseList: workout.exercise_list
		};
	}

	static async addWorkout(name: string, exerciseList: number[]): Promise<PredefinedWorkout> {
		const row = await sql`
            INSERT INTO predefined_workouts (name, exercise_list)
            VALUES (${name}, ${sql.array(exerciseList)})
            RETURNING workout_id
        `;
		return {
			id: row[0].workout_id,
			name,
			exerciseList
		};
	}

	static async updateWorkout(
		workoutID: number,
		updates: { name?: string; exerciseList?: number[] }
	): Promise<PredefinedWorkout | null> {
		if (!updates.name && !updates.exerciseList) {
			return null;
		}
		await sql`
			UPDATE user_workouts
            SET ${sql(updates)}
            WHERE workout_id = ${workoutID}
        `;
		return await this.getPredefinedWorkoutById(workoutID);
	}

	static async deleteWorkout(workoutID: number): Promise<void> {
		await sql`
            DELETE FROM user_workouts WHERE workout_id = ${workoutID}
        `;
	}

	static async addExerciseToWorkout(workoutID: number, exerciseID: number) {
		await sql`UPDATE user_workouts SET exercise_list = array_append(exercise_list, ${exerciseID}) WHERE workout_id=${workoutID}`;
	}
}
