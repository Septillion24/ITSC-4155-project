<script>
	import { get } from 'svelte/store';

	async function createExercise() {
		try {
			const response = await fetch('/api/create/exercise', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: 'BENCHAWN',
					numberOfSets: 3,
					numberOfReps: 10,
					setWeights: [10, 15, 20],
					workoutId: 1,
					muscleGroupID: 2
				})
			});

			const result = await response.json();
			console.log('Exercise created:', result);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async function getExerciseById() {
		console.log('Fetching exercise by ID');
		try {
			console.log('Fetching exercise by ID');
			const response = await fetch('/api/get/exerciseByID', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					excerciseID: 1
				})
			});
			const exercise = await response.json();
			console.log('Exercise:', exercise);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async function updateExercise() {
		try {
			const response = await fetch('/api/update/exercise', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					exercise_id: 1,
					name: 'Updated Exercise',
					number_of_sets: 4,
					number_of_reps: 12,
					set_weights: [15, 20, 25, 30],
					workout_id: 1,
					muscle_group_id: 2
				})
			});

			const result = await response.json();
			console.log('Exercise updated:', result);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async function deleteExercise() {
		try {
			const response = await fetch('/api/delete/exercise', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					exercise_id: 1
				})
			});

			const result = await response.json();
			console.log('Exercise deleted:', result);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async function getExercises() {
		try {
			const response = await fetch('/api/get/exercises');
			const exercises = await response.json();
			console.log('Exercises:', exercises);
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>

<button on:click={createExercise}>Create Exercise</button>
<button on:click={getExerciseById}>Get Exercise by ID</button>
<button on:click={getExercises}>Get Excercises</button>
<button on:click={updateExercise}>Update Exercise</button>
<button on:click={deleteExercise}>Delete Exercise</button>
