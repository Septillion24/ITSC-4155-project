import ExerciseStatRepo from '../../../../classes/ExerciseStatRepo.js';
import type { ExerciseStat } from '../../../../classes/ExerciseStat.js';
export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (requestJSON.excerciseID === undefined) {
		return new Response('Bad Request', { status: 400 });
	}

	const exerciseStat: ExerciseStat | null = await ExerciseStatRepo.getExerciseStatById(
		requestJSON.userID
	);
	if (exerciseStat === null) {
		return new Response('Exercise not found', { status: 404 });
	}
	return new Response(JSON.stringify(exerciseStat), { status: 200 });
}
