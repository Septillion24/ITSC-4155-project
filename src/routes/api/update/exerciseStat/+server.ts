import ExerciseStatRepo from '../../../../classes/ExerciseStatRepo.js';
export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (requestJSON.exerciseStatID === undefined) {
		return new Response('Bad Request', { status: 400 });
	}
	const muscleGroup = await ExerciseStatRepo.updateExerciseStat(
		requestJSON.exerciseStatID,
		requestJSON
	);

	if (!muscleGroup) {
		return new Response('ExerciseStat not found', { status: 404 });
	}
	return new Response(JSON.stringify(muscleGroup), { status: 200 });
}
