import WorkoutStatRepo from '../../../../classes/WorkoutStatRepo.js';

export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (!requestJSON.workoutStatID) {
		return new Response('Bad Request', { status: 400 });
	}

	try {
		const success = await WorkoutStatRepo.deleteWorkoutStat(requestJSON.workoutStatID);

		if (success) {
			return new Response('Workout stat deleted successfully', { status: 200 });
		} else {
			return new Response('Workout stat not found', { status: 404 });
		}
	} catch (error) {
		console.error('Error deleting workout stat:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
