import sql from '$lib/DatabaseConnection';
import type { Exercise } from './Exercise';

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
}
