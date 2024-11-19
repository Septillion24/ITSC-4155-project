export default class Workout {
	workoutId: number;
	name: string;
	exerciseList: number[];
	userID: number | null;

	constructor(
		workoutId: number,
		name: string,
		exerciseList: number[] = [],
		userID: number | null = null
	) {
		this.workoutId = workoutId;
		this.name = name;
		this.exerciseList = exerciseList;
		this.userID = userID;
	}
	public setExerciseList(exerciseList: number[] = []) {
		this.exerciseList = exerciseList;
	}
}
