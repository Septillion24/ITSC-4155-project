import WorkoutRepo from '../../../../classes/WorkoutRepo.js';
import Workout from '../../../../classes/Workout.js';

export async function GET(): Promise<Response> {
	const workouts: Workout[] = await WorkoutRepo.getWorkouts();
	return new Response(JSON.stringify(workouts), { status: 200 });
}
