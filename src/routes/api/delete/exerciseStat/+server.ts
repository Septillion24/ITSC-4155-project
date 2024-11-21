import ExerciseStatRepo from '../../../../classes/ExcerciseRepo.js';

export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (requestJSON.exerciseStatID === undefined) {
		return new Response('Bad Request', { status: 400 });
	}

	await ExerciseStatRepo.deleteExerciseStat(requestJSON.exerciseStatID);
	return new Response('OK', { status: 200 });
}
