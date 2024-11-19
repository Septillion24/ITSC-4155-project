import MuscleGroupRepo from '../../../../classes/MuscleGroupRepo.js';

export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();
	if (requestJSON.name === undefined) {
		return new Response('Bad Request', { status: 400 });
	}
	const muscleGroupInfo = {
		name: requestJSON.name,
		exercise_ids: [],
		user_id: requestJSON.userID
	};

	const muscleGroup = await MuscleGroupRepo.addMuscleGroup(
		muscleGroupInfo.name,
		muscleGroupInfo.exercise_ids,
		muscleGroupInfo.user_id
	);
	return new Response(JSON.stringify(muscleGroup), { status: 200 });
}
