import sql from '$lib/databaseConnection';
import Exercise from './exercise';
export default class ExerciseRepo {
	exercises: Exercise[] = [];
	initialized: boolean = false;

	async init() {
		if (this.initialized) {
			return;
		} else {
			await this.populateExercises();
			this.initialized = true;
		}
	}

	async populateExercises() {
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
		this.exercises = exercisesFromDatabase.map(
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

	getExerciseById(exerciseId: number) {
		return this.exercises.find((exercise) => exercise.exerciseId === exerciseId);
	}
	getExerciseByName(name: string) {
		return this.exercises.find((exercise) => exercise.name === name);
	}
	getExercises() {
		return this.exercises;
	}
	async addExercise(name: string, muscleGroup: string, equipment: string) {
		await sql`INSERT INTO exercises (name, muscleGroup, equipment) VALUES (${name}, ${muscleGroup}, ${equipment})`;
		await this.populateExercises();
	}
	async updateExercise(
		exerciseId: number,
		updates: { name?: string; muscleGroup?: string; equipment?: string }
	) {
		if (!updates.name && !updates.muscleGroup && !updates.equipment) {
			return;
		}
		await sql`UPDATE exercises SET ${sql(updates)} WHERE exercise_id=${exerciseId}`;
		await this.populateExercises();
	}
	async deleteExercise(exerciseId: number) {
		await sql`DELETE FROM exercises WHERE exercise_id=${exerciseId}`;
		await this.populateExercises();
	}
}
