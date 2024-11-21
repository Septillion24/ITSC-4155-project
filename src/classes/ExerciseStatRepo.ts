import sql from '$lib/DatabaseConnection';
import type { ExerciseStat } from './ExerciseStat';

export default class ExerciseStatRepo {
	static async getExerciseStatsByUser(ID: string) {
		type ExcerciseStatFromDatabase = {
			exercise_stat_id: number;
			exercise_id: number;
			user_id: string;
			date: Date;
			sets: number | null;
			reps: number | null;
			weight: number[] | null;
		};
		const exerciseStatsFromDatabase = await sql<ExcerciseStatFromDatabase[]>`
            SELECT * FROM exercise_stats WHERE user_id = ${ID}
        `;
		return exerciseStatsFromDatabase.map((exerciseStat) => ({
			ID: exerciseStat.exercise_stat_id,
			exerciseID: exerciseStat.exercise_id,
			userID: exerciseStat.user_id,
			date: exerciseStat.date,
			sets: exerciseStat.sets,
			reps: exerciseStat.reps,
			weight: exerciseStat.weight
		}));
	}

	static async addExerciseStat(exerciseStatInfo: {
		exerciseID: number;
		userID: string;
		date: Date;
		sets: number | null;
		reps: number | null;
		weight: number[] | null;
	}): Promise<ExerciseStat> {
		const row = await sql`
            INSERT INTO exercise_stats (
                exercise_id, user_id, date, sets, reps, weight
            ) VALUES (
                ${exerciseStatInfo.exerciseID}, ${exerciseStatInfo.userID}, ${exerciseStatInfo.date}, ${exerciseStatInfo.sets}, ${exerciseStatInfo.reps}, ${exerciseStatInfo.weight}
            ) RETURNING exercise_stat_id
        `;
		return {
			ID: row[0].exercise_stat_id,
			exerciseID: exerciseStatInfo.exerciseID,
			userID: exerciseStatInfo.userID,
			date: exerciseStatInfo.date,
			sets: exerciseStatInfo.sets,
			reps: exerciseStatInfo.reps,
			weight: exerciseStatInfo.weight
		};
	}
	static async updateExerciseStat(
		exerciseStatID: number,
		updates: {
			exerciseID?: number;
			userID?: string;
			date?: Date;
			sets?: number | null;
			reps?: number | null;
			weight?: number[] | null;
		}
	) {
		if (
			!updates.exerciseID &&
			!updates.userID &&
			!updates.date &&
			!updates.sets &&
			!updates.reps &&
			!updates.weight
		) {
			return;
		}
		await sql`UPDATE exercise_stats SET ${sql(updates)} WHERE exercise_stat_id=${exerciseStatID}`;
		return await this.getExerciseStatById(exerciseStatID);
	}

	static async getExerciseStatById(exerciseStatID: number): Promise<ExerciseStat | null> {
		type ExerciseStatFromDatabase = {
			exercise_stat_id: number;
			exercise_id: number;
			user_id: string;
			date: Date;
			sets: number | null;
			reps: number | null;
			weight: number[] | null;
		};
		const exerciseStatFromDatabase = await sql<ExerciseStatFromDatabase[]>`
			SELECT * FROM exercise_stats WHERE exercise_stat_id = ${exerciseStatID}
		`;
		if (exerciseStatFromDatabase.length === 0) {
			return null;
		}
		const exerciseStat = exerciseStatFromDatabase[0];
		return {
			ID: exerciseStat.exercise_stat_id,
			exerciseID: exerciseStat.exercise_id,
			userID: exerciseStat.user_id,
			date: exerciseStat.date,
			sets: exerciseStat.sets,
			reps: exerciseStat.reps,
			weight: exerciseStat.weight
		};
	}
	static async deleteExerciseStat(exerciseStatID: number) {
		await sql`DELETE FROM exercise_stats WHERE exercise_stat_id=${exerciseStatID}`;
	}
}
