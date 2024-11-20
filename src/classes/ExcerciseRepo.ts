import sql from '$lib/DatabaseConnection';

export type Exercise = {
	ID: number;
	name: string;
	description: string;
	videoURL: string | null;
};

export default class ExerciseRepo {
	static async getExercises(): Promise<Exercise[]> {
		type exerciseFromDatabase = {
			exercise_id: number;
			name: string;
			description: string;
			video_url: string | null;
		};
		const exercisesFromDatabase = await sql<exerciseFromDatabase[]>`SELECT * FROM exercises`;
		return exercisesFromDatabase.map((exercise) => ({
			ID: exercise.exercise_id,
			name: exercise.name,
			description: exercise.description,
			videoURL: exercise.video_url
		}));
	}

	static async getExerciseByID(ID: number): Promise<Exercise | null> {
		type exerciseFromDatabase = {
			exercise_id: number;
			name: string;
			description: string;
			video_url: string | null;
		};
		const exercisesFromDatabase = await sql<exerciseFromDatabase[]>`
            SELECT * FROM exercises WHERE exercise_id = ${ID}
        `;
		if (exercisesFromDatabase.length === 0) {
			return null;
		}
		const exercise = exercisesFromDatabase[0];
		return {
			ID: exercise.exercise_id,
			name: exercise.name,
			description: exercise.description,
			videoURL: exercise.video_url
		};
	}

	static async addExercise(exerciseInfo: {
		name: string;
		description: string;
		videoURL?: string | null;
	}): Promise<Exercise> {
		const row = await sql`
            INSERT INTO exercises (
                name, description, video_url
            ) VALUES (
                ${exerciseInfo.name}, ${exerciseInfo.description}, ${exerciseInfo.videoURL ?? null}
            ) RETURNING exercise_id
        `;
		const exercise_id = row[0].exercise_id;

		return {
			ID: exercise_id,
			name: exerciseInfo.name,
			description: exerciseInfo.description,
			videoURL: exerciseInfo.videoURL ?? null
		};
	}
}
