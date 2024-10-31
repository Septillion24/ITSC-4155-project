import ExerciseRepo from '../../../../classes/ExcerciseRepo.js';
export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (requestJSON.exercise_id === undefined) {
		return new Response('Bad Request', { status: 400 });
	}

	const exercise = await ExerciseRepo.updateExercise(requestJSON.exercise_id, requestJSON);

	if (!exercise) {
		return new Response('Exercise not found', { status: 404 });
	}
	return new Response(JSON.stringify(exercise), { status: 200 });
}
