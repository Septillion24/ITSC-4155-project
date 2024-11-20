import sql from '$lib/DatabaseConnection';
import MuscleGroup from './MuscleGroup';

export default class MuscleGroupRepo {
	static async getMuscleGroups() {
		type muscleGroupFromDatabase = {
			muscle_group_id: number;
			name: string;
			exercise_ids: number[];
			user_id: string;
		};
		const muscleGroupsFromDatabase = await sql<muscleGroupFromDatabase[]>`
            SELECT * FROM muscle_groups
        `;
		return muscleGroupsFromDatabase.map(
			(muscleGroup) =>
				new MuscleGroup(
					muscleGroup.muscle_group_id,
					muscleGroup.name,
					muscleGroup.exercise_ids,
					muscleGroup.user_id
				)
		);
	}

	static async getMuscleGroupById(muscleGroupID: number) {
		type muscleGroupFromDatabase = {
			muscle_group_id: number;
			name: string;
			exercise_ids: number[];
			user_id: string;
		};
		const muscleGroupFromDatabase = await sql<muscleGroupFromDatabase[]>`
            SELECT * FROM muscle_groups WHERE muscle_group_id = ${muscleGroupID}
        `;
		if (muscleGroupFromDatabase.length === 0) {
			return null;
		}
		const muscleGroup = muscleGroupFromDatabase[0];
		return new MuscleGroup(
			muscleGroup.muscle_group_id,
			muscleGroup.name,
			muscleGroup.exercise_ids,
			muscleGroup.user_id
		);
	}

	static async getMuscleGroupByName(name: string) {
		type muscleGroupFromDatabase = {
			muscle_group_id: number;
			name: string;
			exercise_ids: number[];
			user_id: string;
		};
		const muscleGroupFromDatabase = await sql<muscleGroupFromDatabase[]>`
            SELECT * FROM muscle_groups WHERE name = ${name}
        `;
		if (muscleGroupFromDatabase.length === 0) {
			return null;
		}
		const muscleGroup = muscleGroupFromDatabase[0];
		return new MuscleGroup(
			muscleGroup.muscle_group_id,
			muscleGroup.name,
			muscleGroup.exercise_ids,
			muscleGroup.user_id
		);
	}

	static async addMuscleGroup(name: string, exerciseIDs: number[], userID: number) {
		const row =
			await sql`INSERT INTO muscle_groups (name, exercise_ids, user_id) VALUES (${name}, ${exerciseIDs}, ${userID}) returning muscle_group_id`;
		return new MuscleGroup(row[0].muscle_group_id, name, exerciseIDs);
	}

	static async updateMuscleGroup(
		muscleGroupID: number,
		updates: { name?: string; exercise_ids?: number[]; user_id?: string }
	) {
		if (!updates.name && !updates.exercise_ids && !updates.user_id) {
			return;
		}
		await sql`UPDATE muscle_groups SET ${sql(updates)} WHERE muscle_group_id=${muscleGroupID}`;
		return await this.getMuscleGroupById(muscleGroupID);
	}

	static async deleteMuscleGroup(muscleGroupID: number) {
		await sql`DELETE FROM muscle_groups WHERE muscle_group_id=${muscleGroupID}`;
	}
}
