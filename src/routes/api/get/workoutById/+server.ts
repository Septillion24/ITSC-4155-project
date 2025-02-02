import WorkoutRepo from '../../../../classes/UserWorkoutRepo.js';
import type { UserWorkout } from '../../../../classes/UserWorkout.js';

export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (requestJSON.id === undefined) {
		return new Response('Bad Request', { status: 400 });
	}

	const workout: UserWorkout | null = await WorkoutRepo.getUserWorkoutById(requestJSON.id);
	if (workout === null) {
		return new Response('Workout not found', { status: 404 });
	}
	return new Response(JSON.stringify(workout), { status: 200 });
}
