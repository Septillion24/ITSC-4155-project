export default class MuscleGroup {
	muscleGroupId: number;
	name: string;
	exerciseIDs: number[];
	constructor(muscleGroupId: number, name: string, exerciseIds: number[]) {
		this.muscleGroupId = muscleGroupId;
		this.name = name;
		this.exerciseIDs = exerciseIds;
	}
	public setExerciseList(exerciseIDs: number[] = []) {
		this.exerciseIDs = exerciseIDs;
	}
}
