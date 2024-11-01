import WorkoutRepo from '../../../../classes/WorkoutRepo.js';
import Workout from '../../../../classes/Workout.js';

export async function GET(): Promise<Response> {
	try {
		const workouts: Workout[] = await WorkoutRepo.getWorkouts();
		return new Response(JSON.stringify(workouts), { status: 200 });
	} catch (error) {
		console.error('Error fetching workouts:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
