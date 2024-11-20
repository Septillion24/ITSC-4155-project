<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { ExerciseStat } from '../../../classes/ExerciseStat';
	import LoadingGraphic from '$lib/LoadingGraphic.svelte';
	import type { Exercise } from '../../../classes/Exercise';

	let currentExercise: Exercise | undefined;
	let allExercises: Exercise[];
	let currentExerciseID: number | undefined;
	let allExerciseStats: ExerciseStat[];
	onMount(async () => {
		hash = $page.url.hash.substring(1);
		allExercises = await fetch('/api/get/exercises', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => res.json());
		// allExerciseStats = await fetch('/api/get/exerciseStats', {
		// 	method: 'GET',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	}
		// }).then((res) => res.json());
	});

	$: hash = $page.url.hash.substring(1);
	$: if (hash !== '' && allExercises) {
		currentExerciseID = parseInt(hash);
		currentExercise = allExercises.find((e) => {
			return e.exerciseID === currentExerciseID;
		});
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
</script>

{#if currentExercise}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="content cardContainer" on:mousemove={onMouseMoveContainer}>
		<div class="leftContent">
			<div class="card">
				<div class="flavor cardContent">
					<div class="title unselectable">{currentExercise.name}</div>
					<div class="description">{currentExercise.description}</div>
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
		{#if !currentExercise.videoURL}
			<!-- Change later, remove the ! -->
			<div class="rightContent cardContainer">
				<div class="card">
					<div class="video cardContent">
						<!-- svelte-ignore a11y-missing-attribute -->
						<iframe width="640" height="360" src={currentExercise.videoURL} />
					</div>
				</div>
			</div>
		{/if}
	</div>
{:else if !currentExercise && currentExerciseID}
	<div>Exercise not found: {currentExerciseID}</div>
{:else}
	<div>main page</div>
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
		padding-left: 5%;
		padding-right: 5%;
		font-family: sans-serif;
		display: flex;
		flex-direction: row;
		gap: 10px;
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
	.unselectable {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
</style>
