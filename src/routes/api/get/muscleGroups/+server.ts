import MuscleGroupRepo from '../../../../classes/MuscleGroupRepo.js';
import MuscleGroup from '../../../../classes/MuscleGroup.js';
export async function GET(): Promise<Response> {
	const muscleGroups: MuscleGroup[] = await MuscleGroupRepo.getMuscleGroups();
	return new Response(JSON.stringify(muscleGroups), { status: 200 });
}
