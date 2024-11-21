import UserWorkoutRepo from '../../../../classes/UserWorkoutRepo';
import type { UserWorkout } from '../../../../classes/UserWorkout';
import { SessionManager } from '../../../../classes/SessionManager';

export async function GET({ cookies }): Promise<Response> {
	const token = cookies.get('token');
	if (!token) return new Response('Unauthorized', { status: 401 });
	const user = await SessionManager.getUserFromUUID(token);
	if (!user) return new Response('Unauthorized', { status: 401 });

	const workouts: UserWorkout[] = await UserWorkoutRepo.getUserWorkouts(user.id);
	return new Response(JSON.stringify(workouts), { status: 200 });
}
