import sql from '$lib/_databaseConnection';
import Exercise from './Exercise';
import WorkoutRepo from './WorkoutRepo';
export default class ExerciseRepo {
	static async getExercises() {
		type exerciseFromDatabase = {
			exercise_id: number;
			name: string;
			number_of_sets: number;
			number_of_reps: number;
			set_weights: number[];
			workout_id: number;
			muscle_group_id: number;
		};
		const exercisesFromDatabase = await sql<exerciseFromDatabase[]>`SELECT * FROM exercises`;
		return exercisesFromDatabase.map(
			(exercise) =>
				new Exercise(
					exercise.exercise_id,
					exercise.name,
					exercise.number_of_sets,
					exercise.number_of_reps,
					exercise.set_weights,
					exercise.workout_id,
					exercise.muscle_group_id
				)
		);
	}

	static async getExerciseById(exerciseId: number) {
		type exerciseFromDatabase = {
			exercise_id: number;
			name: string;
			number_of_sets: number;
			number_of_reps: number;
			set_weights: number[];
			workout_id: number;
			muscle_group_id: number;
		};
		const exerciseFromDatabase = await sql<exerciseFromDatabase[]>`
            SELECT * FROM exercises WHERE exercise_id = ${exerciseId}
        `;
		if (exerciseFromDatabase.length === 0) {
			return null;
		}
		const exercise = exerciseFromDatabase[0];
		return new Exercise(
			exercise.exercise_id,
			exercise.name,
			exercise.number_of_sets,
			exercise.number_of_reps,
			exercise.set_weights,
			exercise.workout_id,
			exercise.muscle_group_id
		);
	}

	static async getExerciseByName(name: string) {
		type exerciseFromDatabase = {
			exercise_id: number;
			name: string;
			number_of_sets: number;
			number_of_reps: number;
			set_weights: number[];
			workout_id: number;
			muscle_group_id: number;
		};
		const exerciseFromDatabase = await sql<exerciseFromDatabase[]>`
            SELECT * FROM exercises WHERE name = ${name}
        `;
		if (exerciseFromDatabase.length === 0) {
			return null;
		}
		const exercise = exerciseFromDatabase[0];
		return new Exercise(
			exercise.exercise_id,
			exercise.name,
			exercise.number_of_sets,
			exercise.number_of_reps,
			exercise.set_weights,
			exercise.workout_id,
			exercise.muscle_group_id
		);
	}

	static async addExercise(excerciseInfo: {
		name: string;
		number_of_sets?: number;
		number_of_reps?: number;
		set_weights?: number[];
		workout_id?: number;
		muscle_group_id?: number;
	}) {
		const row = await sql`
            INSERT INTO exercises (
                name, number_of_sets, number_of_reps, set_weights, workout_id, muscle_group_id
            ) VALUES (
                ${excerciseInfo.name}, ${excerciseInfo.number_of_sets ?? 0}, ${excerciseInfo.number_of_reps ?? 0}, ${sql.array(excerciseInfo.set_weights ?? [0])}::int[], ${null}, ${excerciseInfo.muscle_group_id ?? null}
            ) RETURNING exercise_id
        `;
		const exercise_id = row[0].exercise_id;

		if (excerciseInfo.workout_id !== undefined) {
			await WorkoutRepo.addExerciseToWorkout(excerciseInfo.workout_id, exercise_id);
		}

		return new Exercise(
			row[0].exercise_id,
			excerciseInfo.name,
			excerciseInfo.number_of_sets ?? 0,
			excerciseInfo.number_of_reps ?? 0,
			excerciseInfo.set_weights ?? [0],
			excerciseInfo.workout_id ?? null,
			excerciseInfo.muscle_group_id ?? null
		);
	}

	static async updateExercise(
		exerciseId: number,
		updates: {
			name?: string;
			number_of_sets?: number;
			number_of_reps?: number;
			set_weights?: number[];
			workout_id?: number;
			muscle_group_id?: number;
		}
	) {
		if (
			!updates.name &&
			!updates.number_of_sets &&
			!updates.number_of_reps &&
			!updates.set_weights &&
			!updates.workout_id &&
			!updates.muscle_group_id
		) {
			return;
		}
		await sql`
            UPDATE exercises SET ${sql(updates)} WHERE exercise_id = ${exerciseId}
        `;
		const exercise = await this.getExerciseById(exerciseId);
		return exercise;
	}

	static async deleteExercise(exerciseId: number) {
		await sql`
			DELETE FROM exercises WHERE exercise_id = ${exerciseId}
		`;
	}
}
