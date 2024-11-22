import { SessionManager } from '../../../../classes/SessionManager.js';
import WorkoutStatRepo from '../../../../classes/WorkoutStatRepo.js';

export async function POST({ cookies, request }): Promise<Response> {
	const token = cookies.get('token');
	if (!token) return new Response('Unauthorized', { status: 401 });
	const user = await SessionManager.getUserFromUUID(token);
	if (!user) return new Response('Unauthorized', { status: 401 });

	const requestJSON = await request.json();

	if (!requestJSON.workoutID || !requestJSON.date) {
		return new Response('Bad Request', { status: 400 });
	}

	try {
		const workoutStat = await WorkoutStatRepo.addWorkoutStat(
			requestJSON.workoutID,
			user.id,
			new Date(requestJSON.date)
		);
		return new Response(JSON.stringify(workoutStat), { status: 200 });
	} catch (error) {
		console.error('Error creating workout stat:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
