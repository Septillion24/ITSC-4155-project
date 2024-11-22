import sql from '$lib/DatabaseConnection';
import type { WorkoutStat } from './WorkoutStat';

export default class WorkoutStatRepo {
	static async getWorkoutStatsByUser(userID: string): Promise<WorkoutStat[]> {
		type WorkoutStatFromDatabase = {
			id: number;
			workoutID: number;
			date: Date;
			userID: string;
		};

		const workoutStatFromDatabase = await sql<
			WorkoutStatFromDatabase[]
		>`SELECT * FROM workout_stats WHERE user_id = ${userID}`;
		if (workoutStatFromDatabase.length === 0) {
			return [];
		}

		return workoutStatFromDatabase.map((workout) => ({
			id: workout.id,
			workoutID: workout.workoutID,
			date: workout.date,
			userID: workout.userID
		}));
	}

	static async getWorkoutStatById(id: number): Promise<WorkoutStat | null> {
		type WorkoutStatFromDatabase = {
			id: number;
			workoutID: number;
			date: Date;
			userID: string;
		};

		const workoutStatFromDatabase = await sql<WorkoutStatFromDatabase[]>`
            SELECT * FROM workout_stats WHERE id = ${id}
        `;
		if (workoutStatFromDatabase.length === 0) {
			return null;
		}
		const workout = workoutStatFromDatabase[0];
		return {
			id: workout.id,
			workoutID: workout.workoutID,
			date: workout.date,
			userID: workout.userID
		};
	}

	static async addWorkoutStat(workoutID: number, userID: string, date: Date): Promise<WorkoutStat> {
		const row = await sql`
            INSERT INTO workout_stats (workout_id, user_id, date)
            VALUES (${workoutID}, ${userID}, ${date})
            RETURNING id
        `;
		return {
			id: row[0].id,
			workoutID,
			date,
			userID
		};
	}

	static async updateWorkoutStat(
		workoutStatID: number,
		updates: { workoutID?: number; userID?: string; date?: Date }
	): Promise<WorkoutStat | null> {
		if (!updates.workoutID && !updates.userID && !updates.date) {
			return null;
		}

		if (workoutStatID === undefined) {
			console.log('workoutStatID is undefined');
			return null;
		}

		if (workoutStatID === null) {
			console.log('workoutStatID is null');
			return null;
		}

		const queryInfo: { workout_id?: number; user_id?: string; date?: Date } = {};

		if (updates.workoutID !== undefined) {
			queryInfo.workout_id = updates.workoutID;
		}
		if (updates.userID !== undefined) {
			queryInfo.user_id = updates.userID;
		}
		if (updates.date !== undefined) {
			queryInfo.date = updates.date;
		}
		if (Object.keys(queryInfo).length === 0) {
			return null;
		}
		await sql`
            UPDATE workout_stats
            SET ${sql(queryInfo)}
            WHERE id = ${workoutStatID}
        `;
		return await this.getWorkoutStatById(workoutStatID);
	}
	static async deleteWorkoutStat(workoutStatID: number): Promise<boolean> {
		await sql`
            DELETE FROM workout_stats WHERE id = ${workoutStatID}
        `;
		return true;
	}
}
