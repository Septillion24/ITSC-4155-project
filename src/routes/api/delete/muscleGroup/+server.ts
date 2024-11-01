import MuscleGroupRepo from '../../../../classes/MuscleGroupRepo.js';

export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (requestJSON.muscle_group_id === undefined) {
		return new Response('Bad Request', { status: 400 });
	}

	await MuscleGroupRepo.deleteMuscleGroup(requestJSON.muscle_group_id);
	return new Response('OK', { status: 200 });
}
