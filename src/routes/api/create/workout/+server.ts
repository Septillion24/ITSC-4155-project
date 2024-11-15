import WorkoutRepo from '../../../../classes/WorkoutRepo.js';

export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();
	console.log(requestJSON);
	if (requestJSON.name === undefined) {
		return new Response('Bad Request', { status: 400 });
	}
	const workoutInfo = {
		name: requestJSON.name,
		exercise_ids: [],
		user_id: requestJSON.userID
	};
	try {
		const workout = await WorkoutRepo.addWorkout(
			workoutInfo.name,
			workoutInfo.exercise_ids,
			workoutInfo.user_id
		);
		return new Response(JSON.stringify(workout), { status: 200 });
	} catch (error) {
		console.error('Error creating workout:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
