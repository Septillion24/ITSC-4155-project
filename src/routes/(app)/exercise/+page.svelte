<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { ExerciseStat } from '../../../classes/ExerciseStat';
	import LoadingGraphic from '$lib/LoadingGraphic.svelte';
	import type { Exercise } from '../../../classes/Exercise';
	import type { MuscleGroup } from '../../../classes/MuscleGroup';

	let displayContents = true;

	let allExercises: Exercise[];
	let currentExerciseID: number | undefined;
	let allExerciseStats: ExerciseStat[];
	let allMuscleGroups: MuscleGroup[] = [];

	let currentFilterText: string = '';

	onMount(async () => {
		hash = $page.url.hash.substring(1);
		allExercises = await fetch('/api/get/exercises', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => res.json());
		allExerciseStats = await fetch('/api/get/exerciseStats', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => res.json());
		allMuscleGroups = await (await fetch('/api/get/muscleGroups')).json();
	});

	$: hash = $page.url.hash.substring(1);

	$: if (hash !== '' && allExercises) {
		currentExerciseID = parseInt(hash);
	}

	$: if (hash || hash === '') {
		if (hash === '') {
			currentExerciseID = undefined;
		}
		displayContents = false;
		setTimeout(() => {
			displayContents = true;
		}, 100);
	}

	// $: if (hash) {
	// 	displayContents = false;
	// 	setTimeout(() => {
	// 		displayContents = true;
	// 	}, 1);
	// }

	function onMouseMoveContainer(e: MouseEvent) {
		for (const card of document.getElementsByClassName('card')) {
			const rect = card.getBoundingClientRect(),
				x = e.clientX - rect.left,
				y = e.clientY - rect.top;

			(card as HTMLDivElement).style.setProperty('--mouse-x', `${x}px`);
			(card as HTMLDivElement).style.setProperty('--mouse-y', `${y}px`);
		}
	}

	// function getColorFromBodyGroup(bodyGroup: string | undefined) {
	// 	if (bodyGroup === 'Legs') return 'blue';
	// 	if (bodyGroup === 'Back') return 'red';
	// 	if (bodyGroup === 'Shoulders') return 'purple';
	// 	if (bodyGroup === 'Arms') return 'green';
	// 	if (bodyGroup === 'Chest') return 'orange';
	// 	else return 'darkgray';
	// }

	function getMuscleGroupForExercise(excerciseID: number) {
		if (allMuscleGroups.length === 0) throw new Error('where all the white muscle groups at');
		return allMuscleGroups.find((muscleGroup) => muscleGroup.exerciseIDs.includes(excerciseID));
	}
</script>

{#if allExerciseStats && allExercises && allMuscleGroups.length > 0 && displayContents}
	{@const currentExercise = allExercises.find((e) => {
		return e.id === currentExerciseID;
	})}
	{#if currentExerciseID && currentExercise}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="content cardContainer" on:mousemove={onMouseMoveContainer}>
			<div class="leftContent">
				<div class="card">
					<div class="flavor cardContent">
						<div class="title unselectable">{currentExercise.name}</div>
						<div class="description">{currentExercise?.description}</div>
					</div>
				</div>
				<div class="card">
					<div class="stats cardContent">
						<div class="title">Stats</div>
						<div>
							{#if allExerciseStats}
								{#each allExerciseStats.filter((stat) => {
									return stat.exerciseID === currentExerciseID;
								}) as workoutStat}
									<div class="workoutStat">
										<div class="numbers">
											{workoutStat.sets}x{workoutStat.reps}
										</div>
										<div class="date">
											{workoutStat.date}
										</div>
									</div>
								{/each}
							{:else}
								<LoadingGraphic />
							{/if}
						</div>
					</div>
				</div>
				<div class=""></div>
			</div>
			{#if currentExercise.videoURL}
				<div class="rightContent cardContainer">
					<div class="card">
						<div class="video cardContent">
							<!-- svelte-ignore a11y-missing-attribute -->
							<iframe width="360" height="640" src={currentExercise.videoURL}> </iframe>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{:else if !currentExercise && currentExerciseID}
		<div>Exercise not found: {currentExerciseID}</div>
	{:else if !currentExerciseID}
		<div class="allExerciseContent">
			<div class="header">
				<div class="title">All Exercises</div>
				<div class="count">
					<span
						>{allExercises.filter((e) =>
							e.name.toLowerCase().includes(currentFilterText.toLowerCase())
						).length}</span
					>
					/ {allExercises.length}
				</div>
				<div class="filter">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
						fill="#5f6368"
					>
						<path
							d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z"
						/>
					</svg>
					<input placeholder="Type to filter..." bind:value={currentFilterText} />
				</div>
			</div>

			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="exercises cardContainer" on:mousemove={onMouseMoveContainer}>
				{#each allExercises
					.filter((e) => e.name.toLowerCase().includes(currentFilterText.toLowerCase()))
					.sort((a, b) => a.name.localeCompare(b.name)) as exercise (exercise.id)}
					<a class="exercise card" href="/exercise#{exercise.id}">
						<div class="cardContent">
							<div class="top">
								<div class="name">{exercise.name}</div>
								<div></div>
								<div class="bodyGroup {getMuscleGroupForExercise(exercise.id)?.name.toLowerCase()}">
									{getMuscleGroupForExercise(exercise.id)?.name}
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/if}
{/if}

<style lang="scss">
	.cardContainer {
		&:hover {
			.card::after {
				opacity: 1;
			}
		}
		.card {
			background-color: rgba(255, 255, 255, 0.1);
			border-radius: 10px;
			display: flex;
			flex-direction: column;
			position: relative;
			z-index: 1;

			&:hover::before {
				opacity: 1;
			}

			&::before,
			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				border-radius: inherit;
				opacity: 0;
				transition: opacity 500ms;
				pointer-events: none;
			}

			&::before {
				background: radial-gradient(
					800px circle at var(--mouse-x) var(--mouse-y),
					rgba(255, 255, 255, 0.04),
					transparent 40%
				);
				z-index: 3;
			}

			&::after {
				background: radial-gradient(
					800px circle at var(--mouse-x) var(--mouse-y),
					rgba(255, 255, 255, 0.4),
					transparent 40%
				);
				z-index: 1;
			}

			> .cardContent {
				position: relative;
				background-color: #222;
				border-radius: inherit;
				display: flex;
				flex-direction: column;
				flex-grow: 1;
				margin: 1px;
				padding: 10px;
				z-index: 2;
			}
		}
	}
	.content {
		width: 100%;
		height: 80vh;
		box-sizing: border-box;
		padding: 40px;
		padding-left: 10%;
		padding-right: 10%;
		font-family: sans-serif;
		display: flex;
		flex-direction: row;
		gap: 5%;
		// justify-content: space-between;
		.leftContent {
			display: flex;
			flex-direction: column;
			height: 100%;
			width: 60%;
			color: rgb(211, 211, 211);
			gap: 10px;
			box-sizing: border-box;

			.flavor {
				padding-left: 30px;
				padding-right: 30px;
				padding-top: 20px;
				padding-bottom: 20px;
				.title {
					font-size: 2em;
					padding-left: 5%;
					padding-bottom: 12px;
				}
			}
			.stats {
				padding-left: 30px;
				padding-right: 30px;
				padding-top: 20px;
				padding-bottom: 20px;
				.title {
					font-size: 1.4em;
				}
			}
		}
	}
	.allExerciseContent {
		overflow-y: hidden;
		.header {
			display: flex;
			flex-direction: row;
			gap: 10px;
			color: white;
			align-items: end;
			padding-top: 24px;
			font-family: sans-serif;
			padding-bottom: 12px;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.title {
				font-size: 1.6em;
			}
			.count {
				font-size: 1.3em;
				color: gray;
				span {
					color: rgb(201, 201, 201);
				}
			}
			.filter {
				position: relative;
				display: flex;
				align-items: center;
				margin-left: 1em;
				width: 40%;
				svg {
					position: absolute;
					left: 0;
					width: 2em;
					height: auto;
					padding: 0.1em;
					box-sizing: border-box;
					fill: rgb(255, 255, 255);
				}
				input {
					padding-left: 1.5em !important;
					width: 100%;
					padding: 6px;
					font-size: 1.3em;
					color: white;
					background-color: rgb(211, 222, 255);
					border: none;
					&::placeholder {
						color: rgb(105, 105, 105);
					}
					&:focus::placeholder {
						color: white;
					}
					&:focus {
						outline: none;
						background-color: #a8b1e6;
					}
				}
			}
		}

		.exercises {
			width: 100%;
			padding-left: 10%;
			padding-right: 10%;
			box-sizing: border-box;
			margin-left: auto;
			margin-right: auto;
			display: flex;
			flex-direction: row;
			gap: 30px;
			flex-wrap: wrap;
			justify-content: center;
			overflow-y: auto;
			max-height: 70vh;
			position: relative;

			.exercise {
				width: 40%;
				border-radius: 10px;
				min-height: 7em;
				color: white;
				text-decoration: none;
				margin-top: 20px;
				.cardContent {
					background-color: #272830;
				}
				.top {
					width: 100%;
					padding: 12px;
					box-sizing: border-box;
					display: flex;
					flex-direction: row;
					// justify-content: space-between;
					font-family: sans-serif;
					.name {
						width: 85%;
						font-size: 1.2em;
					}
					.bodyGroup {
						// width: 20%;
						padding: 3px;
						border-radius: 6px;
						color: white;
						&.back {
							background-color: #5a7fa7; /* Washed-out deeper blue */
						}
						&.chest {
							background-color: #b48c5e; /* Muted amber-brown */
						}
						&.legs {
							background-color: #89a97d; /* Soft olive green */
						}
						&.arms {
							background-color: #8b6caa; /* Washed-out muted purple */
						}
						&.shoulders {
							background-color: #b96868; /* Muted brick red */
						}
					}
				}
			}
		}
	}
	.unselectable {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
</style>
