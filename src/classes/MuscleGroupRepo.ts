import sql from '$lib/DatabaseConnection';
import type { MuscleGroup } from './MuscleGroup';

export default class MuscleGroupRepo {
	static async getMuscleGroups(): Promise<MuscleGroup[]> {
		type muscleGroupFromDatabase = {
			muscle_group_id: number;
			name: string;
			exercise_ids: number[];
		};
		const muscleGroupsFromDatabase = await sql<
			muscleGroupFromDatabase[]
		>`SELECT * FROM muscle_groups`;
		return muscleGroupsFromDatabase.map((muscleGroup) => ({
			ID: muscleGroup.muscle_group_id,
			name: muscleGroup.name,
			exerciseIDs: muscleGroup.exercise_ids
		}));
	}

	static async getMuscleGroupById(muscleGroupID: number): Promise<MuscleGroup | null> {
		type muscleGroupFromDatabase = {
			muscle_group_id: number;
			name: string;
			exercise_ids: number[];
		};
		const muscleGroupsFromDatabase = await sql<muscleGroupFromDatabase[]>`
            SELECT * FROM muscle_groups WHERE muscle_group_id = ${muscleGroupID}
        `;
		if (muscleGroupsFromDatabase.length === 0) {
			return null;
		}
		const muscleGroup = muscleGroupsFromDatabase[0];
		return {
			ID: muscleGroup.muscle_group_id,
			name: muscleGroup.name,
			exerciseIDs: muscleGroup.exercise_ids
		};
	}

	static async getMuscleGroupByName(name: string): Promise<MuscleGroup | null> {
		type muscleGroupFromDatabase = {
			muscle_group_id: number;
			name: string;
			exercise_ids: number[];
		};
		const muscleGroupFromDatabase = await sql<muscleGroupFromDatabase[]>`
            SELECT * FROM muscle_groups WHERE name = ${name}
        `;
		if (muscleGroupFromDatabase.length === 0) {
			return null;
		}
		const muscleGroup = muscleGroupFromDatabase[0];
		return {
			ID: muscleGroup.muscle_group_id,
			name: muscleGroup.name,
			exerciseIDs: muscleGroup.exercise_ids
		};
	}
}
