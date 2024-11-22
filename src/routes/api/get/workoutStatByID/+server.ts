import WorkoutStatRepo from '../../../../classes/WorkoutStatRepo.js';

export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (!requestJSON.id) {
		return new Response('Bad Request', { status: 400 });
	}

	try {
		const workoutStat = await WorkoutStatRepo.getWorkoutStatById(requestJSON.id);

		if (!workoutStat) {
			return new Response('Workout stat not found', { status: 404 });
		}

		return new Response(JSON.stringify(workoutStat), { status: 200 });
	} catch (error) {
		console.error('Error getting workout stat:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
