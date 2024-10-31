export default class Exercise {
	exerciseId: number;
	name: string;
	numberOfSets: number;
	numberOfReps: number;
	setWeights: number[];
	workoutID: number | null;
	muscleGroupID: number | null;

	constructor(
		exerciseId: number,
		name: string,
		numberOfSets: number,
		numberOfReps: number,
		setWeights: number[] = [],
		workoutID: number | null = null,
		muscleGroupID: number | null = null
	) {
		this.exerciseId = exerciseId;
		this.name = name;
		this.numberOfSets = numberOfSets;
		this.numberOfReps = numberOfReps;
		this.setWeights = setWeights; // Array of weights for each set
		this.workoutID = workoutID; // String representing workout group
		this.muscleGroupID = muscleGroupID; // String representing muscle group
	}
}
