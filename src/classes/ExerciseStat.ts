export type ExerciseStat = {
	ID: number;
	exerciseID: number;
	userID: string;
	date: Date;
	sets: number | null;
	reps: number | null;
	weight: number[] | null;
};
