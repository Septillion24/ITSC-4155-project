import MuscleGroup from '../../../../classes/MuscleGroup.js';
import ExerciseRepo from '../../../../classes/MuscleGroupRepo.js';

export async function POST({ request }): Promise<Response> {
	console.log('POST /api/create/muscleGroup');
	const requestJSON = await request.json();
	console.log('after requestJSON');
	if (requestJSON.name === undefined) {
		return new Response('Bad Request', { status: 400 });
	}

	const muscleGroupInfo = {
		name: requestJSON.name,
        exercise_ids: requestJSON.exerciseIDs,
        muscle_group_id: requestJSON.muscleGroupId
	};
	console.log('muscleGroupInfo:');

	console.log(muscleGroupInfo);
	const muscleGroup = await MuscleGroupRepo.addMuscleGroup(muscleGroupInfo);
	return new Response(JSON.stringify(MuscleGroup), { status: 200 });
}
