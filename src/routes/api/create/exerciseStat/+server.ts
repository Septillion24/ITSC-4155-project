import ExerciseStatRepo from '../../../../classes/ExerciseStatRepo.js';
import { SessionManager } from '../../../../classes/SessionManager.js';
export async function POST({ cookies, request }): Promise<Response> {
	const requestJSON = await request.json();

	const token = cookies.get('token');
	if (!token) return new Response('Unauthorized', { status: 401 });
	const user = await SessionManager.getUserFromUUID(token);
	if (!user) return new Response('Unauthorized', { status: 401 });

	const excerciseStatInfo = {
		exerciseID: requestJSON.exerciseID,
		userID: user.id,
		date: new Date(),
		sets: requestJSON.sets,
		reps: requestJSON.reps,
		weight: requestJSON.weight
	};
	const exercise = await ExerciseStatRepo.addExerciseStat(excerciseStatInfo);
	return new Response(JSON.stringify(exercise), { status: 200 });
}
