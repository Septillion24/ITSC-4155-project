import ExerciseStatRepo from '../../../../classes/ExerciseStatRepo.js';
import type { ExerciseStat } from '../../../../classes/ExerciseStat.js';
export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (requestJSON.userID === undefined) {
		return new Response('Bad Request', { status: 400 });
	}

	const exerciseStats: ExerciseStat[] | null = await ExerciseStatRepo.getExerciseStatsByUser(
		requestJSON.userID
	);
	if (exerciseStats === null) {
		return new Response('Exercise not found', { status: 404 });
	}
	return new Response(JSON.stringify(exerciseStats), { status: 200 });
}
