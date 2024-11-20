import sql from '$lib/DatabaseConnection';

export type ExerciseStat = {
	ID: number;
	exerciseID: number;
	userID: string;
	date: Date;
	sets: number;
	reps: number;
	weight: number[];
};

export default class ExerciseStatRepo {
	static async getExerciseStatsByUser(ID: string) {
		type ExcerciseStatFromDatabase = {
			exercise_stat_id: number;
			exercise_id: number;
			user_id: string;
			date: Date;
			sets: number;
			reps: number;
			weight: number[];
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
		sets: number;
		reps: number;
		weight: number[];
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
	static async updateExerciseStat() {}
}
