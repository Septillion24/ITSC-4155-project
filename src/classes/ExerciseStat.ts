export type ExerciseStat = {
	id: number;
	exerciseID: number;
	userID: string;
	date: Date;
	sets: number;
	reps: number;
	weight: number[];
};
