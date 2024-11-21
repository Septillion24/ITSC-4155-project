import ExerciseStatRepo from '../../../../classes/ExerciseStatRepo.js';
export async function POST({ request }): Promise<Response> {
	const requestJSON = await request.json();
	if (requestJSON.name === undefined) {
		return new Response('Bad Request', { status: 400 });
	}
	const excerciseStatInfo = {
		exerciseID: requestJSON.exerciseID,
		userID: requestJSON.userID,
		date: requestJSON.date,
		sets: requestJSON.sets,
		reps: requestJSON.reps,
		weight: requestJSON.weight
	};
	const exercise = await ExerciseStatRepo.addExerciseStat(excerciseStatInfo);
	return new Response(JSON.stringify(exercise), { status: 200 });
}
