import WorkoutRepo from '../../../../classes/UserWorkoutRepo.js';

export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (requestJSON.id === undefined) {
		return new Response('Bad Request', { status: 400 });
	}
	const workout = await WorkoutRepo.updateWorkout(requestJSON.id, {
		exerciseList: requestJSON.exerciseIDs
	});
	// yeah this isnt secure but we'll fix it when we get funding

	if (!workout) {
		return new Response('Workout not found', { status: 404 });
	}

	return new Response(JSON.stringify(workout), { status: 200 });
}
