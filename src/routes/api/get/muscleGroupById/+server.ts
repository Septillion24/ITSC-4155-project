import MuscleGroupRepo from '../../../../classes/MuscleGroupRepo.js';
import MuscleGroup from '../../../../classes/MuscleGroup.js';
export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();

	if (requestJSON.muscleGroupID === undefined) {
		return new Response('Bad Request', { status: 400 });
	}

	const MuscleGroup: MuscleGroup | null = await MuscleGroupRepo.getMuscleGroupById(
		requestJSON.muscleGroupID
	);
	if (MuscleGroup === null) {
		return new Response('MuscleGroup not found', { status: 404 });
	}
	return new Response(JSON.stringify(MuscleGroup), { status: 200 });
}
