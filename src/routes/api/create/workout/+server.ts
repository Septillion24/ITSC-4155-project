import WorkoutRepo from '../../../../classes/WorkoutRepo.js';

export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (requestJSON.name === undefined) {
		return new Response('Bad Request', { status: 400 });
	}

	try {
		const workout = await WorkoutRepo.addWorkout(requestJSON.name, requestJSON.exercise_ids);
		return new Response(JSON.stringify(workout), { status: 200 });
	} catch (error) {
		console.error('Error creating workout:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
