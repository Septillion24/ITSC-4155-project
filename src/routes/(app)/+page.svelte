<script lang="ts">
	import Accordion from '$lib/Accordion.svelte';
	import Modal from '$lib/Modal.svelte';
	import { onMount } from 'svelte';
	import type { Exercise } from '../../classes/Exercise';
	import type { MuscleGroup } from '../../classes/MuscleGroup';
	import type { UserWorkout } from '../../classes/UserWorkout';
	import LoadingGraphic from '$lib/LoadingGraphic.svelte';
	import type { ExerciseStat } from '../../classes/ExerciseStat';

	let showAddNewExerciseModal = false;
	let showAddNewWorkoutsModal = false;
	let currentlyEditingWorkout: number | undefined = undefined;

	let workouts: UserWorkout[] = [];
	let exercises: Exercise[] = [];
	let muscleGroups: MuscleGroup[] = [];
	let allExerciseStats: ExerciseStat[] = [];

	let workout: String = '';
	let exerciseName: String;
	let muscleGroup: String = '';
	let set: Number;
	let lbs: Number[];
	let reps: Number;

	let cookies: {
		[key: string]: string;
	};

	onMount(async () => {
		exercises = await (await fetch('/api/get/exercises')).json();
		workouts = await (await fetch('/api/get/workouts')).json();
		muscleGroups = await (await fetch('/api/get/muscleGroups')).json();
		allExerciseStats = await (await fetch('/api/get/exerciseStats')).json();
		console.log(workouts);
		console.log(exercises);
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
		for (const exercise of exercises) {
			if (exercise.id === id) {
				return exercise;
			}
		}
		return null;
	}

	function onMouseMoveContainer(e: MouseEvent) {
		for (const card of document.getElementsByClassName('card')) {
			const rect = card.getBoundingClientRect(),
				x = e.clientX - rect.left,
				y = e.clientY - rect.top;

			(card as HTMLDivElement).style.setProperty('--mouse-x', `${x}px`);
			(card as HTMLDivElement).style.setProperty('--mouse-y', `${y}px`);
		}
	}

	$: if (typeof window !== 'undefined') {
		cookies = document.cookie.split(';').reduce((acc, cookie) => {
			const [key, value] = cookie.split('=').map((item) => item.trim());
			// @ts-ignore
			acc[key] = value;
			return acc;
		}, {});
	}

	function getCookie(cookie: string): string | undefined {
		console.log(cookies);
		if (cookies) {
			return cookies[cookie];
		} else {
			return undefined;
		}
	}

	function getAllExerciseDays(
		exerciseStats: ExerciseStat[]
	): [{ stats: ExerciseStat[]; isToday: boolean; isPassed: boolean }] {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const sunday = new Date(today);
		sunday.setDate(sunday.getDate() - sunday.getDay());

		const weekData: { stats: ExerciseStat[]; isToday: boolean; isPassed: boolean }[] = [];

		for (let i = 0; i < 7; i++) {
			const currentDay = new Date(sunday);
			currentDay.setDate(sunday.getDate() + i);

			const statsForTheDay = exerciseStats.filter((stat) => {
				const statDate = new Date(stat.date);
				statDate.setHours(0, 0, 0, 0);
				return statDate.getTime() === currentDay.getTime();
			});

			weekData.push({
				stats: statsForTheDay,
				isToday: currentDay.getTime() === today.getTime(),
				isPassed: currentDay.getTime() < today.getTime()
			});
		}

		return weekData as [{ stats: ExerciseStat[]; isToday: boolean; isPassed: boolean }];
	}

	function getDayNameFromNumber(number: number) {
		const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		return dayNames[number] || 'Invalid day';
	}
</script>

{#if cookies && getCookie('token')}
	{#if exercises.length > 0 && workouts.length > 0 && muscleGroups.length > 0 && allExerciseStats !== undefined}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="container cardContainer" on:mousemove={onMouseMoveContainer}>
			<div class="card workouts">
				<div class="cardContent">
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
									{@const jawn = console.log(exercise)}
									{#if exercise !== null}
										<div class="excercise">
											<button class="delete">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													height="24px"
													viewBox="0 -960 960 960"
													width="24px"
													fill="#5f6368"><path d="M200-440v-80h560v80H200Z" /></svg
												>
												<div class="text">Remove?</div>
											</button>
											<a class="name" href="/exercise#{exercise.id}">{exercise.name}</a>
										</div>
									{/if}
								{/each}
								<button
									class="addExcercise"
									on:click={() => {
										currentlyEditingWorkout = workout.id;
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
			</div>

			<div class="card muscleGroups">
				<div class="cardContent">
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
			</div>

			<div class="card workoutSchedule">
				<div class="cardContent">
					<div class="header">WORKOUT SCHEDULE</div>
					<div class="schedule">
						{#each getAllExerciseDays(allExerciseStats) as day, i}
							<div class="day {day.isPassed ? 'past' : ''} {day.isToday ? 'today' : ''}">
								<div class="dayName unselectable">
									{getDayNameFromNumber(i)}
								</div>
								<div class="stats">
									<button class="add">
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
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{:else}
		<LoadingGraphic />
	{/if}
{:else if cookies}
	<!-- Not logged in -->
	<div class="homeContent">
		<div class="welcome">
			Welcome to <span>Pump Palooza</span>
		</div>
		<div class="subtext">The better workout tracker</div>
		<div class="login">
			<a href="/login">Log in now!</a>
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
	.container {
		font-family: sans-serif;
		background-color: #202020;
		color: rgb(228, 228, 228);
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		margin: 0 auto;
		min-height: 100%;
		row-gap: 10px;
		max-width: 1000px;
		width: calc(100% - 20px);
		box-sizing: border-box;

		.workouts {
			margin: 8px;
			box-sizing: border-box;
			width: calc(50% - 16px);
			border-radius: 10px;
			.header-container {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 4px 15px 0px;
				border-bottom: 1px solid #616161;
			}
			.header {
				padding: 10px;
				padding-left: 15px;
				padding-bottom: 5px;
				width: 100%;
			}
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
				align-items: center;
				justify-content: center;
				text-align: center;
				.excercise,
				.addExcercise {
					padding-left: 20px;
					padding-right: 20px;
					padding-top: 7px;
					padding-bottom: 7px;
					min-width: calc(50% - 10px);
					width: fit-content;
					box-sizing: border-box;
					border-radius: 10px;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					gap: 10px;

					.name {
						font-size: 12pt;
						font-family: sans-serif;
						color: white;
						text-decoration: none;
					}
				}
				.excercise {
					position: relative;
					background-color: #666;
					padding-left: 15%;
					display: flex;
					flex-direction: row;
					.delete {
						position: absolute;
						left: 0;
						top: 0;
						width: 2em;
						background-color: rgba(255, 0, 0, 0.2);
						height: 100%;
						border: none;
						border-top-left-radius: 10px;
						border-bottom-left-radius: 10px;
						align-items: left;
						text-align: left;
						overflow: hidden;
						display: flex;
						flex-direction: row;
						&:hover {
							transition: 400ms;
							width: 100%;
							background-color: rgb(190, 0, 0);
							border-top-right-radius: 10px;
							border-bottom-right-radius: 10px;
							svg {
								transition: 300ms;
								height: 100%;
								min-width: 1.5em;
								fill: rgb(255, 216, 216);
							}
						}

						svg {
							height: 100%;
							min-width: 1.3em;
							fill: rgb(252, 252, 252);
						}
						.text {
							align-items: center;
							font-size: 1.3em;
							display: flex;
							margin-left: 1em;
							height: 100%;
							text-align: left;
							width: calc(100% / 0.05);
							align-items: center;
							color: white;
						}
					}
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
			border-radius: 10px;
			.header {
				padding: 10px;
				padding-left: 15px;
				padding-bottom: 5px;
				width: 90%;
				border-bottom: 1px solid #616161;
			}
			.muscleGroupsContainer {
				width: 100%;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
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
		.workoutSchedule {
			margin: 10px;
			box-sizing: border-box;
			width: 100%;
			border-radius: 10px;
			.cardContent {
				padding: 20px;
				.header {
					padding: 10px;
					padding-left: 15px;
					padding-bottom: 20px;
					width: 100%;
				}
				.schedule {
					width: 100%;
					display: flex;
					flex-direction: row;
					.day {
						width: calc(100% / 7);
						background-color: rgba(255, 255, 255, 0.08);
						color: rgba(255, 255, 255, 0.9);
						border-left: 1px solid rgba(255, 255, 255, 0.3);
						min-height: 14vh;
						&:last-child {
							border-right: 1px solid rgba(255, 255, 255, 0.3);
						}
						&.past {
							color: rgba(255, 255, 255, 0.623);
							background-color: rgba(0, 0, 0, 0.08);
						}

						border-right: 1px solid rgba(255, 255, 255, 0.3);
						&.today {
							color: rgb(194, 195, 255);
							background-color: rgba(0, 26, 255, 0.08);
						}
						&:hover {
							.stats > .add {
								visibility: visible;
							}
						}
						.dayName {
							font-size: 0.8em;
							width: 100%;
							text-align: center;
							padding-top: 0.4em;
						}
						.stats {
							display: flex;
							flex-direction: column;
							gap: 0.3em;
							width: 100%;
							align-items: center;
							padding-top: 0.3em;

							.add {
								visibility: hidden;
								border-radius: 10px;
								background-color: transparent;
								border: 2px dashed #666;
								color: #666;
								padding: 3px;
								justify-content: center;
								align-items: center;
								width: fit-content;
								cursor: pointer;
								.addText {
									padding-right: 0.3em;
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
				}
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

	.homeContent {
		color: white;
		font-family: sans-serif;
		.welcome {
			font-size: 2.3em;
			width: 100%;
			text-align: center;
			span {
				color: rgb(115, 115, 255);
			}
		}
		.subtext {
			font-size: 1.3em;
			width: 100%;
			text-align: center;
			color: rgb(187, 187, 187);
			font-style: italic;
			font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
		}
		.login {
			width: 100%;
			display: flex;
			justify-content: center;
			a {
				color: white;
				padding: 12px;
				font-size: 1.4em;
				margin-top: 20px;
				text-decoration: none;
				border: 1px solid rgb(199, 199, 199);
				background-color: #888;
				border-radius: 10px;
				&:hover {
					background-color: rgb(107, 107, 107);
					text-decoration: underline;
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
