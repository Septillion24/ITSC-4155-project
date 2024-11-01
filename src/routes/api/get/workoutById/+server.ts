import WorkoutRepo from '../../../../classes/WorkoutRepo.js';
import Workout from '../../../../classes/Workout.js';

export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (requestJSON.workout_id === undefined) {
		return new Response('Bad Request', { status: 400 });
	}

	const workout: Workout | null = await WorkoutRepo.getWorkoutById(requestJSON.workout_id);
	if (workout === null) {
		return new Response('Workout not found', { status: 404 });
	}
	return new Response(JSON.stringify(workout), { status: 200 });
}
