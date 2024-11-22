import WorkoutStatRepo from '../../../../classes/WorkoutStatRepo.js';

export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (!requestJSON.workoutID || !requestJSON.userID || !requestJSON.date) {
		return new Response('Bad Request', { status: 400 });
	}

	try {
		const workoutStat = await WorkoutStatRepo.addWorkoutStat(
			requestJSON.workoutID,
			requestJSON.userID,
			new Date(requestJSON.date)
		);
		return new Response(JSON.stringify(workoutStat), { status: 200 });
	} catch (error) {
		console.error('Error creating workout stat:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
