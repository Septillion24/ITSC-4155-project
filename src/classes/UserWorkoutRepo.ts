import sql from '$lib/DatabaseConnection';
import type { UserWorkout } from './UserWorkout';

export default class UserWorkoutRepo {
	static async getUserWorkouts(userID: string): Promise<UserWorkout[]> {
		type WorkoutFromDatabase = {
			id: number;
			name: string;
			exercise_list: number[];
			user_id: string | null;
		};
		const workoutsFromDatabase = await sql<
			WorkoutFromDatabase[]
		>`SELECT * FROM user_workouts WHERE user_id = ${userID}`;
		if (workoutsFromDatabase.length === 0) {
			return [];
		}
		return workoutsFromDatabase.map((workout) => ({
			id: workout.id,
			name: workout.name,
			exerciseList: workout.exercise_list,
			userID: workout.user_id
		}));
	}

	static async getUserWorkoutById(workoutID: number): Promise<UserWorkout | null> {
		type UserWorkoutFromDatabase = {
			workout_id: number;
			name: string;
			exercise_list: number[];
			user_id: string | null;
		};
		const workoutsFromDatabase = await sql<UserWorkoutFromDatabase[]>`
            SELECT * FROM user_workouts WHERE workout_id = ${workoutID}
        `;
		if (workoutsFromDatabase.length === 0) {
			return null;
		}
		const workout = workoutsFromDatabase[0];
		return {
			id: workout.workout_id,
			name: workout.name,
			exerciseList: workout.exercise_list,
			userID: workout.user_id
		};
	}

	static async addWorkout(
		name: string,
		exerciseList: number[],
		userID: string | null
	): Promise<UserWorkout> {
		const row = await sql`
            INSERT INTO user_workouts (name, exercise_list, user_id)
            VALUES (${name}, ${sql.array(exerciseList)}, ${userID})
            RETURNING id
        `;
		return {
			id: row[0].workout_id,
			name,
			exerciseList,
			userID
		};
	}

	static async updateWorkout(
		workoutID: number,
		updates: { name?: string; exerciseList?: number[]; userID?: string | null }
	): Promise<UserWorkout | null> {
		if (!updates.name && !updates.exerciseList && !updates.userID) {
			return null;
		}
		await sql`
			UPDATE user_workouts
            SET ${sql(updates)}
            WHERE workout_id = ${workoutID}
        `;
		return await this.getUserWorkoutById(workoutID);
	}

	static async deleteWorkout(workoutID: number): Promise<void> {
		await sql`
            DELETE FROM user_workouts WHERE id = ${workoutID}
        `;
	}

	static async addExerciseToWorkout(workoutID: number, exerciseID: number) {
		await sql`UPDATE user_workouts SET exercise_list = array_append(exercise_list, ${exerciseID}) WHERE id=${workoutID}`;
	}
}
