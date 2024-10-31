import sql from '$lib/DatabaseConnection';
import MuscleGroup from './MuscleGroup';

export default class MuscleGroupRepo {
	static async getMuscleGroups() {
		type muscleGroupFromDatabase = {
			muscle_group_id: number;
			name: string;
			exerciseIds: number[];
		};
		const muscleGroupsFromDatabase = await sql<muscleGroupFromDatabase[]>`
            SELECT * FROM muscle_groups
        `;
		return muscleGroupsFromDatabase.map(
			(muscleGroup) =>
				new MuscleGroup(muscleGroup.muscle_group_id, muscleGroup.name, muscleGroup.exerciseIds)
		);
	}

	static async getMuscleGroupById(muscleGroupId: number) {
		type muscleGroupFromDatabase = {
			muscle_group_id: number;
			name: string;
			exerciseIds: number[];
		};
		const muscleGroupFromDatabase = await sql<muscleGroupFromDatabase[]>`
            SELECT * FROM muscle_groups WHERE muscle_group_id = ${muscleGroupId}
        `;
		if (muscleGroupFromDatabase.length === 0) {
			return null;
		}
		const muscleGroup = muscleGroupFromDatabase[0];
		return new MuscleGroup(muscleGroup.muscle_group_id, muscleGroup.name, muscleGroup.exerciseIds);
	}

	static async getMuscleGroupByName(name: string) {
		type muscleGroupFromDatabase = {
			muscle_group_id: number;
			name: string;
			exerciseIds: number[];
		};
		const muscleGroupFromDatabase = await sql<muscleGroupFromDatabase[]>`
            SELECT * FROM muscle_groups WHERE name = ${name}
        `;
		if (muscleGroupFromDatabase.length === 0) {
			return null;
		}
		const muscleGroup = muscleGroupFromDatabase[0];
		return new MuscleGroup(muscleGroup.muscle_group_id, muscleGroup.name, muscleGroup.exerciseIds);
	}

	static async addMuscleGroup(name: string, exerciseIds: number[]) {
		const row =
			await sql`INSERT INTO muscle_groups (name, exerciseIds) VALUES (${name}, ${exerciseIds}) returning muscle_group_id`;
		return new MuscleGroup(row[0].muscle_group_id, name, exerciseIds);
	}

	static async updateMuscleGroup(
		muscleGroupId: number,
		updates: { name?: string; exerciseIds?: number[] }
	) {
		if (!updates.name && !updates.exerciseIds) {
			return;
		}
		await sql`UPDATE muscle_groups SET ${sql(updates)} WHERE muscle_group_id=${muscleGroupId}`;
	}
}
