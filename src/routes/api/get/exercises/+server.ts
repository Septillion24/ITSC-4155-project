import ExerciseRepo from '../../../../classes/ExcerciseRepo.js';
import Exercise from '../../../../classes/ExcerciseRepo.js';
export async function GET(): Promise<Response> {
	const exercises: Exercise[] = await ExerciseRepo.getExercises();
	return new Response(JSON.stringify(exercises), { status: 200 });
}
