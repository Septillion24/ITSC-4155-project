import WorkoutRepo from '../../../../classes/WorkoutRepo.js';

export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (requestJSON.workout_id === undefined) {
		return new Response('Bad Request', { status: 400 });
	}

	try {
		await WorkoutRepo.deleteWorkout(requestJSON.workout_id);
		return new Response('OK', { status: 200 });
	} catch (error) {
		console.error('Error deleting workout:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
