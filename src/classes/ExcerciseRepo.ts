import sql from '$lib/DatabaseConnection';
import Exercise from './Exercise';

export default class ExerciseRepo {

    async getExercises() {
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

    async getExerciseById(exerciseId: number) {
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

    async getExerciseByName(name: string) {
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

    async addExercise(changes: {
        name: string,
        number_of_sets: number,
        number_of_reps: number,
        set_weights: number[],
        workout_id?: number,
        muscle_group_id?: number
	}
    ) {
        await sql`
            INSERT INTO exercises (name, number_of_sets, number_of_reps, set_weights, workout_id, muscle_group_id)
            VALUES (${sql(changes)})
        `;
    }

    async updateExercise(
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
    }
}
