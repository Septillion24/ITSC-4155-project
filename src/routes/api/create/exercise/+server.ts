import ExerciseRepo from '../../../../classes/ExcerciseRepo.js';

export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();
	if (requestJSON.name === undefined) {
		return new Response('Bad Request', { status: 400 });
	}
	const excerciseInfo = {
		name: requestJSON.name,
		muscle_group_id: requestJSON.muscleGroupID,
		number_of_sets: requestJSON.numberOfSets,
		number_of_reps: requestJSON.numberOfReps,
		set_weights: requestJSON.setWeights,
		workout_id: requestJSON.workoutId,
		user_id: requestJSON.userID
	};
	const exercise = await ExerciseRepo.addExercise(excerciseInfo);
	return new Response(JSON.stringify(exercise), { status: 200 });
}
