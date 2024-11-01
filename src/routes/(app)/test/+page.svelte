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

	async function createMuscleGroup() {
		try {
			const response = await fetch('/api/create/muscleGroup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: 'New Muscle Group',
					exerciseIDs: [1, 2, 3]
				})
			});

			const result = await response.json();
			return result;
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async function getMuscleGroups() {
		try {
			const response = await fetch('/api/get/muscleGroups');
			const muscleGroups = await response.json();
			console.log('Muscle Groups:', muscleGroups);
		} catch (error) {
			console.error('Error:', error);
		}
	}
	async function getMuscleGroupById() {
		try {
			const response = await fetch('/api/get/muscleGroupById', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					muscleGroupID: 1
				})
			});
			const muscleGroup = await response.json();
			console.log('Muscle Group:', muscleGroup);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async function updateMuscleGroup() {
		try {
			const response = await fetch('/api/update/muscleGroup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					muscle_group_id: 1,
					name: 'Chest',
					exercise_ids: [1, 2, 3, 4]
				})
			});

			const result = await response.json();
			console.log('Muscle Group updated:', result);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async function deleteMuscleGroup() {
		try {
			const response = await fetch('/api/delete/muscleGroup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					muscle_group_id: 6
				})
			});

			const result = await response.json();
			console.log('Muscle Group deleted:', result);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	// ``````

	async function createWorkout() {
		try {
			const response = await fetch('/api/create/workout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: 'New Workout',
					exercise_ids: [1, 2, 3]
				})
			});

			const result = await response.json();
			return result;
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async function getWorkouts() {
		try {
			const response = await fetch('/api/get/workouts');
			const workouts = await response.json();
			console.log('Workouts:', workouts);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async function getWorkoutById() {
		try {
			const response = await fetch('/api/get/workoutById', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					workout_id: 1
				})
			});
			const workout = await response.json();
			console.log('Workout:', workout);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async function updateWorkout() {
		try {
			const response = await fetch('/api/update/workout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					workout_id: 1,
					name: 'Updated Workout',
					exercise_list: [1, 2, 3, 4]
				})
			});
			const result = await response.json();
			console.log('Workout updated:', result);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async function deleteWorkout() {
		try {
			const response = await fetch('/api/delete/workout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					workout_id: 6
				})
			});

			const result = await response.json();
			console.log('Workout deleted:', result);
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

<button on:click={createMuscleGroup}>Create Muscle Group</button>
<button on:click={getMuscleGroups}>Get Muscle Groups</button>
<button on:click={getMuscleGroupById}>Get Muscle Group by ID</button>
<button on:click={updateMuscleGroup}>Update Muscle Group</button>
<button on:click={deleteMuscleGroup}>Delete Muscle Group</button>

<button on:click={createWorkout}>Create Workout</button>
<button on:click={getWorkouts}>Get Workouts</button>
<button on:click={getWorkoutById}>Get Workout by ID</button>
<button on:click={updateWorkout}>Update Workout</button>
<button on:click={deleteWorkout}>Delete Workout</button>
