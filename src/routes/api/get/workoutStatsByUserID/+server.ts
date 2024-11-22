import WorkoutStatRepo from '../../../../classes/WorkoutStatRepo.js';

export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (!requestJSON.userID) {
		return new Response('Bad Request', { status: 400 });
	}

	try {
		const workoutStats = await WorkoutStatRepo.getWorkoutStatsByUser(requestJSON.userID);

		return new Response(JSON.stringify(workoutStats), { status: 200 });
	} catch (error) {
		console.error('Error getting workout stats:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
