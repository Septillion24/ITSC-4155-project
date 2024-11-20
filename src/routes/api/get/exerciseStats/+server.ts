import ExerciseStatRepo from '../../../../classes/ExerciseStatRepo.js';
import { SessionManager } from '../../../../classes/SessionManager.js';
export async function GET({ cookies }): Promise<Response> {
	const token = cookies.get('token');
	if (!token) return new Response('Unauthorized', { status: 401 });
	const userID = SessionManager.getUserFromUUID(token);
	const exerciseStats = ExerciseStatRepo.getExerciseStatsByUser(userID);
	return new Response(JSON.stringify(exerciseStats), { status: 200 });
}
