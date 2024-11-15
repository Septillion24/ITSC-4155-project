<script lang="ts">
	import Accordion from '$lib/Accordion.svelte';
	import Modal from '$lib/Modal.svelte';
	import { onMount } from 'svelte';
	import Exercise from '../../classes/Exercise';
	import type MuscleGroup from '../../classes/MuscleGroup';
	import type Workout from '../../classes/Workout';

	let showAddNewExerciseModal = false;
	let showAddNewWorkoutsModal = false;
	let currentlyEditingWorkout: number | undefined = undefined;

	let workouts: Workout[] = [];

	let exercises: Exercise[] = [];

	let muscleGroups: MuscleGroup[] = [];

	let workout: String = '';
	let exerciseName: String;
	let muscleGroup: String = '';
	let set: Number;
	let lbs: Number[];
	let reps: Number;

	onMount(async () => {
		exercises = await (await fetch('/api/get/exercises')).json();
		workouts = await (await fetch('/api/get/workouts')).json();
		muscleGroups = await (await fetch('/api/get/muscleGroups')).json();
	});

	async function submitNewWorkout() {
		const response = fetch('/api/create/workout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: workout
			})
		});
	}

	async function submitNewExercise() {
		const response = fetch('/api/create/exercise', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: exerciseName,
				numberOfSets: set,
				numberOfReps: reps,
				setWeights: lbs,
				workoutId: currentlyEditingWorkout,
				userID: null //Needs userID once added
			})
		});
	}
	function getExerciseById(id: number) {
		console.log('Getitng excercise with id: ' + id);
		for (const exercise of exercises) {
			if (exercise.exerciseID === id) {
				console.log(exercise);
				return exercise;
			}
		}
		return null;
	}

	$: console.log(workouts);
</script>

{#if exercises.length > 0 && workouts.length > 0 && muscleGroups.length > 0}
	<div class="container">
		<div class="workouts">
			<div class="header-container">
				<div class="header">WORKOUTS</div>
				<button
					class="add-workout-button"
					on:click={() => {
						showAddNewWorkoutsModal = true;
					}}
				>
					<div class="addText">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
							fill="#5f6368"
							><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg
						>
					</div>
				</button>
			</div>
			{#each workouts as workout}
				<Accordion workoutTitle={workout.name} exerciseNumber={workout.exerciseList.length}>
					<div class="workoutContent">
						{#each workout.exerciseList as excerciseID}
							{@const exercise = getExerciseById(excerciseID)}
							{#if exercise !== null}
								<div class="excercise">
									<div class="name">{exercise.name}</div>
									<div class="muscleGroup">{exercise.muscleGroupID}</div>
									<div class="sets">{exercise.numberOfSets} x {exercise.numberOfReps}</div>
								</div>
							{/if}
						{/each}
						<button
							class="addExcercise"
							on:click={() => {
								currentlyEditingWorkout = workout.workoutId;
								showAddNewExerciseModal = true;
							}}
						>
							<div class="addText">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="24px"
									viewBox="0 -960 960 960"
									width="24px"
									fill="#5f6368"
									><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg
								>
								<div class="text">New</div>
							</div>
						</button>
					</div>
				</Accordion>
			{/each}
		</div>

		<div class="muscleGroups">
			<div class="header">MUSCLE GROUPS</div>
			<div class="muscleGroupsContainer">
				{#each muscleGroups as muscleGroup}
					<div class="muscleGroup">
						{muscleGroup.name}
					</div>
				{/each}
				<div class="addMuscleGroup">
					<div class="addText">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
							fill="#5f6368"
							><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg
						>
						<div class="text">New</div>
					</div>
				</div>
			</div>
		</div>

		<div class="workout-schedule">
			<h4>WORKOUT SCHEDULE</h4>
			<div class="schedule-day">Sun 08</div>
			<div class="schedule-day">Mon 09</div>
			<div class="schedule-day">...</div>
		</div>
	</div>
{/if}

<Modal bind:showModal={showAddNewWorkoutsModal}>
	<div class="modalContent">
		<div class="label-input-container">
			<label for="workout">Workouts</label>
			<input
				bind:value={workout}
				type="text"
				id="workout"
				name="workout"
				placeholder="Enter Workout"
			/>
			<button class="submit-button" on:click={submitNewWorkout}>Submit</button>
		</div>
	</div>
</Modal>

<Modal bind:showModal={showAddNewExerciseModal}>
	<div class="modalContent">
		<div class="label-input-container">
			<label for="exercise-name">Exercise Name</label>
			<input
				bind:value={exerciseName}
				type="text"
				id="exercise-name"
				name="exercise-name"
				placeholder="Enter Exercise Name"
			/>
		</div>
		<div class="label-input-container">
			<label for="muscle-group">MuscleGroup</label>
			<select bind:value={muscleGroup} id="muscle-group">
				<option>Select</option>
				<option>Chest</option>
				<option>Back</option>
				<option>Biceps</option>
			</select>
		</div>
		<div class="set-details-container">
			<label for="set">Set</label>
			<input
				bind:value={set}
				type="number"
				id="set"
				name="set"
				min="1"
				step="1"
				placeholder="Enter Set #"
			/>
			<label for="lbs">Lbs</label>
			<input bind:value={lbs} type="number" id="lbs" name="lbs" min="0" placeholder="Enter Lbs" />
			<label for="reps">Reps</label>
			<input
				bind:value={reps}
				type="number"
				id="reps"
				name="reps"
				min="1"
				placeholder="Enter Reps"
			/>
		</div>
		<button class="add-set-button">+ Add Set</button>
		<button class="add-set-button" on:click={submitNewExercise}>Submit</button>
	</div>
</Modal>

<style lang="scss">
	:global(body) {
		margin: 0;
		padding: 0;
	}

	.container {
		font-family: sans-serif;
		background-color: #616161;
		color: rgb(228, 228, 228);
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		margin: 0 auto;
		padding: 20px;
		min-height: 100%;
		row-gap: 10px;
		width: 100%;
		padding-left: 25%;
		padding-right: 25%;
		box-sizing: border-box;
		.workouts {
			margin: 8px;
			box-sizing: border-box;
			width: calc(50% - 16px);
			background-color: #444;
			border-radius: 10px;
			.header-container {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 4px 15px 0px;
				border-bottom: 1px solid #616161;
			}
			/*.header {
				padding: 10px;
				padding-left: 15px;
				padding-bottom: 5px;
				width: 100%;
				border-bottom: 1px solid #616161;
			}*/
			.add-workout-button {
				background-color: transparent;
				color: #888;
				border: none;
				font-size: 1.5em;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.workoutContent {
				width: 100%;
				display: flex;
				gap: 10px;
				flex-wrap: wrap;
				padding: 20px;
				box-sizing: border-box;
				overflow: hidden;
				.excercise,
				.addExcercise {
					padding-left: 20px;
					padding-right: 20px;
					padding-top: 7px;
					padding-bottom: 7px;
					width: calc(50% - 10px);
					box-sizing: border-box;
					border-radius: 10px;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					gap: 10px;

					.name {
						font-size: 12pt;
					}
					.muscleGroup {
						font-size: 10pt;
					}
					.sets {
						font-size: 10pt;
					}
				}
				.excercise {
					background-color: #666;
				}
				.addExcercise {
					background-color: transparent;
					border: 2px dashed #666;
					color: #666;
					justify-content: center;
					align-items: center;
					font-size: 1.05em;
					cursor: pointer;
					.addText {
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 1.2em;
						svg {
							fill: #666;
							height: 1.2em;
							width: 1.2em;
						}
					}
					&:hover {
						transition: 0.2s;
						border: 2px dashed #999;
						color: #999;
						svg {
							transition: 0.2s;
							fill: #999;
							animation-name: wiggle;
							animation-duration: 0.5s;
							animation-iteration-count: 1;
						}
					}
				}
			}
		}
		.muscleGroups {
			margin: 8px;
			box-sizing: border-box;
			width: calc(50% - 16px);
			background-color: #444;
			border-radius: 10px;
			.header {
				padding: 10px;
				padding-left: 15px;
				padding-bottom: 5px;
				width: 100%;
				border-bottom: 1px solid #616161;
			}
			.muscleGroupsContainer {
				width: 100%;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				// justify-content: center;
				gap: 20px;
				padding: 15px;
				box-sizing: border-box;
				.muscleGroup,
				.addMuscleGroup {
					width: calc(50% - 10px);
					background-color: #666;
					border-radius: 13px;
					padding: 8px;
					box-sizing: border-box;
					text-align: center;
				}
				.addMuscleGroup {
					background-color: transparent;
					border: 2px dashed #666;
					color: #666;
					padding: 3px;
					justify-content: center;
					align-items: center;
					// font-size: 1.05em;
					cursor: pointer;
					.addText {
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 1.2em;
						svg {
							fill: #666;
							height: 1.2em;
							width: 1.2em;
						}
					}
					&:hover {
						transition: 0.2s;
						border: 2px dashed #999;
						color: #999;
						svg {
							transition: 0.2s;
							fill: #999;
							animation-name: wiggle;
							animation-duration: 0.5s;
							animation-iteration-count: 1;
						}
					}
				}
			}
		}

		.workout-schedule {
			margin: 10px;
			box-sizing: border-box;
			width: 100%;
			background-color: #444;
			padding: 20px;
			border-radius: 10px;
			.schedule-day {
				margin-bottom: 10px;
				background-color: #666;
				padding: 10px;
				border-radius: 5px;
				text-align: center;
			}
		}
	}
	.modalContent {
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 15px;
		width: 500px;
		.label-input-container {
			display: flex;
			flex-direction: column;
			background-color: #444;
			border-radius: 5px;
			padding: 12px;
			label {
				color: #ddd;
				font-size: 1rem;
				margin-bottom: 5px;
			}
			input,
			select {
				padding: 8px;
				border-radius: 5px;
				font-size: 0.9rem;
			}
		}
		.set-details-container {
			background-color: #444;
			border-radius: 5px;
			padding: 10px;
			display: flex;
			gap: 10px;
			input {
				width: 100%;
				border-radius: 5px;
			}
		}
		.add-set-button {
			padding: 10px;
			background-color: #444;
			color: #fff;
			border: none;
			border-radius: 5px;
			cursor: pointer;
			font-size: 1rem;
			text-align: center;
		}
		.submit-button {
			margin-top: 10px;
			padding: 10px;
			border: none;
			border-radius: 5px;
			background-color: #5f6368;
			color: #fff;
			cursor: pointer;
			font-size: 1rem;
		}
	}
	@keyframes wiggle {
		0% {
			transform: rotate(0);
		}
		25% {
			transform: rotate(-30deg);
		}
		50% {
			transform: rotate(30deg);
		}
		75% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(0);
		}
	}
</style>
