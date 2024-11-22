import { SessionManager } from '../../../../classes/SessionManager.js';
import WorkoutStatRepo from '../../../../classes/WorkoutStatRepo.js';

export async function GET({ cookies }): Promise<Response> {
	const token = cookies.get('token');
	if (!token) return new Response('Unauthorized', { status: 401 });
	const user = await SessionManager.getUserFromUUID(token);
	if (!user) return new Response('Unauthorized', { status: 401 });

	try {
		const workoutStats = await WorkoutStatRepo.getWorkoutStatsByUser(user.id);

		return new Response(JSON.stringify(workoutStats), { status: 200 });
	} catch (error) {
		console.error('Error getting workout stats:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
