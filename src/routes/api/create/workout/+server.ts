import { SessionManager } from '../../../../classes/SessionManager.js';
import WorkoutRepo from '../../../../classes/UserWorkoutRepo.js';

export async function POST({ cookies, request }): Promise<Response> {
	const requestJSON = await request.json();
	if (requestJSON.name === undefined) {
		return new Response('Bad Request', { status: 400 });
	}

	const token = cookies.get('token');
	if (!token) return new Response('Unauthorized', { status: 401 });
	const userID = (await SessionManager.getUserFromUUID(token))?.id;
	if (!userID) return new Response('Unauthorized', { status: 401 });

	const workoutInfo = {
		name: requestJSON.name,
		exercise_ids: [],
		user_id: userID
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
