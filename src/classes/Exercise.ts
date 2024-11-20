export default class Exercise {
	exerciseID: number;
	name: string;
	numberOfSets: number;
	numberOfReps: number;
	setWeights: number[];
	workoutID: number | null;
	muscleGroupID: number | null;
	userID: string | null;

	constructor(
		exerciseID: number,
		name: string,
		numberOfSets: number,
		numberOfReps: number,
		setWeights: number[] = [],
		workoutID: number | null = null,
		muscleGroupID: number | null = null,
		userID: string | null = null
	) {
		this.exerciseID = exerciseID;
		this.name = name;
		this.numberOfSets = numberOfSets;
		this.numberOfReps = numberOfReps;
		this.setWeights = setWeights;
		this.workoutID = workoutID;
		this.muscleGroupID = muscleGroupID;
		this.userID = userID;
	}

	toJson() {
		return {
			exerciseId: this.exerciseID,
			name: this.name,
			numberOfSets: this.numberOfSets,
			numberOfReps: this.numberOfReps,
			setWeights: this.setWeights,
			workoutID: this.workoutID,
			muscleGroupID: this.muscleGroupID,
			userID: this.userID
		};
	}
}
