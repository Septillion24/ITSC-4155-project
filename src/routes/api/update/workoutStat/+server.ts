import WorkoutStatRepo from '../../../../classes/WorkoutStatRepo.js';

export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (!requestJSON.id) {
		return new Response('Bad Request', { status: 400 });
	}

	try {
		const updatedWorkoutStat = await WorkoutStatRepo.updateWorkoutStat(requestJSON.id, requestJSON);

		if (!updatedWorkoutStat) {
			return new Response('Workout stat not found or no updates provided', { status: 404 });
		}

		return new Response(JSON.stringify(updatedWorkoutStat), { status: 200 });
	} catch (error) {
		console.error('Error updating workout stat:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
