import MuscleGroupRepo from '../../../../classes/MuscleGroupRepo.js';
export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (requestJSON.muscle_group_id === undefined) {
		return new Response('Bad Request', { status: 400 });
	}
	const muscleGroup = await MuscleGroupRepo.updateMuscleGroup(
		requestJSON.muscle_group_id,
		requestJSON
	);

	if (!muscleGroup) {
		return new Response('MuscleGroup not found', { status: 404 });
	}
	return new Response(JSON.stringify(muscleGroup), { status: 200 });
}
