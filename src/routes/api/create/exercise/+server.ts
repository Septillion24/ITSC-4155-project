import ExerciseRepo from '../../../../classes/ExcerciseRepo.js';

export async function POST({ request, cookies }): Promise<Response> {
	let requestJSON = await request.json();
	if (
		requestJSON.name === undefined ||
		requestJSON.muscleGroup === undefined ||
		requestJSON.equipment === undefined
	) {
		return new Response('Bad Request', { status: 400 });
	}
	ExerciseRepo.addExercise(requestJSON.name, requestJSON.muscleGroup, requestJSON.equipment);
	return new Response('OK', { status: 200 });
}
