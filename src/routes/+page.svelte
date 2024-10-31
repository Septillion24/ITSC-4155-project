<script lang="ts">
	import Accordion from '$lib/Accordion.svelte';
	import Exercise from '../classes/Exercise';
	import type Workout from '../classes/Workout';

	let workouts: Workout[] = [
		{ workoutId: 0, name: 'pull', exerciseList: [0, 0, 0] },
		{ workoutId: 1, name: 'Workout 2', exerciseList: [0] },
		{ workoutId: 2, name: 'Workout 3', exerciseList: [0] }
	];

	let exercises: Exercise[] = [
		{
			exerciseId: 0,
			name: 'jawn',
			numberOfSets: 4,
			numberOfReps: 10,
			setWeights: [1],
			workoutID: 0,
			muscleGroupID: 0
		}
	];

	let openWorkoutIndex: number | null = null;

	function toggleWorkout(index: number) {
		openWorkoutIndex = openWorkoutIndex === index ? null : index;
	}

	function getExerciseById(id: number) {
		for (const exercise of exercises) {
			if (exercise.exerciseId === id) {
				return exercise;
			}
		}
		return null;
	}
</script>

<div class="container">
	<div class="workouts">
		<div class="header">WORKOUTS</div>
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
					<button class="addExcercise">
						<div class="addText">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="24px"
								viewBox="0 -960 960 960"
								width="24px"
								fill="#5f6368"
								><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg
							>
							<div class="text">Add</div>
						</div>
					</button>
				</div>
			</Accordion>
		{/each}
	</div>

	<div class="muscle-groups">
		<h4>MUSCLE GROUPS</h4>
		<p>Back</p>
		<p>Shoulders</p>
		<p>Chest</p>
		<p>Quads</p>
		<p>Triceps</p>
		<p>Core</p>
		<p>...</p>
	</div>

	<div class="workout-schedule">
		<h4>WORKOUT SCHEDULE</h4>
		<div class="schedule-day">Sun 08</div>
		<div class="schedule-day">Mon 09</div>
		<div class="schedule-day">...</div>
	</div>
</div>

<style lang="scss">
	:global(body) {
		margin: 0;
		padding: 0;
	}

	.container {
		font-family: sans-serif;
		background-color: #616161;
		color: white;
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

			.header {
				padding: 10px;
				padding-left: 15px;
				padding-bottom: 5px;
				width: 100%;
				border-bottom: 1px solid #616161;
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
		.muscle-groups {
			margin: 8px;
			box-sizing: border-box;
			width: calc(50% - 16px);
			background-color: #444;
			border-radius: 10px;
			padding: 15px;
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
