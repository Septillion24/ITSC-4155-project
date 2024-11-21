import WorkoutRepo from '../../../../classes/UserWorkoutRepo.js';

export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (requestJSON.workout_id === undefined) {
		return new Response('Bad Request', { status: 400 });
	}

	const workout = await WorkoutRepo.updateWorkout(requestJSON.workout_id, requestJSON);

	if (!workout) {
		return new Response('Workout not found', { status: 404 });
	}

	return new Response(JSON.stringify(workout), { status: 200 });
}
