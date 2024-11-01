import ExerciseRepo from '../../../../classes/ExcerciseRepo.js';

export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (requestJSON.exercise_id === undefined) {
		return new Response('Bad Request', { status: 400 });
	}

	await ExerciseRepo.deleteExercise(requestJSON.exercise_id);
	return new Response('OK', { status: 200 });
}
