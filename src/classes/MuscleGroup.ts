export default class MuscleGroup {
	muscleGroupID: number;
	name: string;
	exerciseIDs: number[];
	userID: string | null;
	constructor(
		muscleGroupID: number,
		name: string,
		exerciseIDs: number[],
		userID: string | null = null
	) {
		this.muscleGroupID = muscleGroupID;
		this.name = name;
		this.exerciseIDs = exerciseIDs;
		this.userID = userID;
	}
	public setExerciseList(exerciseIDs: number[] = []) {
		this.exerciseIDs = exerciseIDs;
	}
}
