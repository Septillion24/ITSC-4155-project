import ExerciseStatRepo from '../../../../classes/ExerciseStatRepo.js';
import { SessionManager } from '../../../../classes/SessionManager.js';
export async function GET({ cookies }): Promise<Response> {
	const token = cookies.get('token');
	if (!token) return new Response('Unauthorized', { status: 401 });
	const user = await SessionManager.getUserFromUUID(token);
	if (user === null) return new Response('No user found', { status: 404 });
	const exerciseStats = ExerciseStatRepo.getExerciseStatsByUser(user.id);
	return new Response(JSON.stringify(exerciseStats), { status: 200 });
}
