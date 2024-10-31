export default class Workout {
	workoutId: number;
	name: string;
	exerciseList: number[];

	constructor(workoutId: number, name: string, exerciseList: number[] = []) {
		this.workoutId = workoutId;
		this.name = name;
		this.exerciseList = exerciseList; // Array of exercise IDs
	}

	public setExerciseList(exerciseList: number[] = []) {
		this.exerciseList = exerciseList;
	}
}
