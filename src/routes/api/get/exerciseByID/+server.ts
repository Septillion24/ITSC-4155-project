import ExerciseRepo from '../../../../classes/ExcerciseRepo.js';
import Exercise from '../../../../classes/Exercise.js';
export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (requestJSON.excerciseID === undefined) {
		return new Response('Bad Request', { status: 400 });
	}

	const exercise: Exercise | null = await ExerciseRepo.getExerciseByID(requestJSON.excerciseID);
	if (exercise === null) {
		return new Response('Exercise not found', { status: 404 });
	}
	return new Response(JSON.stringify(exercise), { status: 200 });
}
