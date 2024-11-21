export type ExerciseStat = {
	id: number;
	exerciseID: number;
	userID: string;
	date: Date;
	sets: number | null;
	reps: number | null;
	weight: number[] | null;
};
