<script lang="ts">
	import Accordion from '$lib/Accordion.svelte';
	import Modal from '$lib/Modal.svelte';
	import { onMount } from 'svelte';
	import type { Exercise } from '../../classes/Exercise';
	import type { MuscleGroup } from '../../classes/MuscleGroup';
	import type { UserWorkout } from '../../classes/UserWorkout';
	import LoadingGraphic from '$lib/LoadingGraphic.svelte';
	import type { ExerciseStat } from '../../classes/ExerciseStat';
	// @ts-ignore
	import clickOutside from 'svelte-outside-click';

	let showAddNewExerciseModal = false;
	let currentlyEditingWorkout: number | undefined = undefined;
	let showNewWorkoutPopout: boolean = false;

	let workouts: UserWorkout[] = [];
	let exercises: Exercise[] = [];
	let muscleGroups: MuscleGroup[] = [];
	let allExerciseStats: ExerciseStat[] = [];

	let currentlyFilteredWorkoutIDs: number[] = [];
	let currentlyFilteredExerciseIDs: number[] = [];
	let currentlyFilteredMuscleGroup: number | undefined = undefined;

	let newWorkoutName: string = '';
	let currentlWaitingForWorkoutSubmission: boolean = false;

	let currentFilterText: string = '';
	let currentlySelectedExerciseIds: number[] = [];

	let cookies: {
		[key: string]: string;
	};

	onMount(async () => {
		exercises = await (await fetch('/api/get/exercises')).json();
		workouts = await (await fetch('/api/get/workouts')).json();
		muscleGroups = await (await fetch('/api/get/muscleGroups')).json();
		allExerciseStats = await (await fetch('/api/get/exerciseStats')).json();
	});

	async function submitNewWorkout() {
		const response = fetch('/api/create/workout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: newWorkoutName
			})
		});
		return response;
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

	function getCurrentlyFilteredWorkoutIDsByMuscleGroupID(muscleGroupID: number): number[] {
		const relatedExerciseIDs = new Set<number>();
		for (const group of muscleGroups) {
			if (group.id === muscleGroupID) {
				group.exerciseIDs.forEach((exerciseID) => relatedExerciseIDs.add(exerciseID));
				break;
			}
		}

		const filteredWorkoutIDs = workouts
			.filter((workout) =>
				workout.exerciseList.some((exerciseID) => relatedExerciseIDs.has(exerciseID))
			)
			.map((workout) => workout.id);

		return filteredWorkoutIDs;
	}

	function getCurrentlyFilteredExerciseIDsByMuscleGroupID(muscleGroupID: number): number[] {
		const muscleGroup = muscleGroups.find((group) => group.id === muscleGroupID);
		if (muscleGroup) {
			return muscleGroup.exerciseIDs;
		} else {
			return [];
		}
	}

	function getNumberOfExercisesInWorkoutByMuscleGroup(
		workoutID: number,
		muscleGroupID: number
	): number {
		const relatedExerciseIDs = new Set<number>();
		for (const group of muscleGroups) {
			if (group.id === muscleGroupID) {
				group.exerciseIDs.forEach((exerciseID) => relatedExerciseIDs.add(exerciseID));
				break;
			}
		}

		const workout = workouts.find((workout) => workout.id === workoutID);
		if (!workout) {
			return 0;
		}

		const count = workout.exerciseList.filter((exerciseID) =>
			relatedExerciseIDs.has(exerciseID)
		).length;

		return count;
	}

	async function handleAddNewWorkout() {
		currentlWaitingForWorkoutSubmission = true;
		const response = await submitNewWorkout();
		currentlWaitingForWorkoutSubmission = false;
		if (response.ok) {
			newWorkoutName = '';
			workouts = [...workouts, (await response.json()) as UserWorkout];
		}
	}

	async function updateWorkout() {
		const response = await fetch('/api/update/workout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: currentlyEditingWorkout,
				exerciseIDs: currentlySelectedExerciseIds
			})
		});
		if (response.ok) {
			const workout = workouts.find((w) => w.id === currentlyEditingWorkout);
			if (workout) {
				workout.exerciseList = [...currentlySelectedExerciseIds];
			}
		} else {
			console.error('Failed to update workout:', response.statusText);
		}
	}

	async function handleRemoveExerciseFromWorkout(workoutID: number, exerciseID: number) {
		const response = await fetch('/api/delete/exerciseFromWorkout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				workoutID: workoutID,
				exerciseID: exerciseID
			})
		});
		if (response.ok) {
			const workout = workouts.find((w) => w.id === workoutID);
			if (workout) {
				workout.exerciseList = workout.exerciseList.filter((id) => id !== exerciseID);
			}
			workouts = workouts;
		} else {
			console.error('Failed to remove exercise from workout:', response.statusText);
		}
	}

	function getWorkoutFromId(id: number) {
		return workouts.filter((w) => w.id === id)[0];
	}

	$: if (currentlyFilteredMuscleGroup) {
		currentlyFilteredExerciseIDs = getCurrentlyFilteredExerciseIDsByMuscleGroupID(
			currentlyFilteredMuscleGroup
		);
	}

	$: if (currentlyFilteredMuscleGroup) {
		currentlyFilteredWorkoutIDs = getCurrentlyFilteredWorkoutIDsByMuscleGroupID(
			currentlyFilteredMuscleGroup
		);
	}

	$: if (!currentlyFilteredMuscleGroup) currentlyFilteredExerciseIDs = [];

	$: console.log(currentlyFilteredExerciseIDs);
</script>

{#if cookies && getCookie('token')}
	{#if exercises.length > 0 && workouts.length > 0 && muscleGroups.length > 0 && allExerciseStats !== undefined}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="container cardContainer" on:mousemove={onMouseMoveContainer}>
			<div class="card muscleGroups">
				<div class="cardContent">
					<div class="header">
						MUSCLE GROUPS
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
					</div>
					<div class="muscleGroupsContainer">
						{#each muscleGroups as muscleGroup}
							<button
								on:click={() => {
									if (currentlyFilteredMuscleGroup !== muscleGroup.id) {
										currentlyFilteredMuscleGroup = muscleGroup.id;
									} else {
										currentlyFilteredMuscleGroup = undefined;
									}
								}}
								class="muscleGroup {currentlyFilteredMuscleGroup === muscleGroup.id
									? 'active'
									: ''}"
							>
								{muscleGroup.name}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div class="card workouts">
				<div class="cardContent">
					<div class="header-container">
						<div class="header">WORKOUTS</div>
						<div class="addNewWorkout">
							<button
								class="add-workout-button"
								style={showNewWorkoutPopout ? 'visibility:hidden;' : ''}
								on:click={(e) => {
									showNewWorkoutPopout = !showNewWorkoutPopout;
									e.stopPropagation();
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="24px"
									viewBox="0 -960 960 960"
									width="24px"
									fill="#5f6368"
									><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg
								>
							</button>

							{#if showNewWorkoutPopout}
								<div
									class="popout"
									use:clickOutside={() => {
										showNewWorkoutPopout = false;
									}}
								>
									<!-- svelte-ignore a11y-autofocus -->
									<input
										placeholder="Name your new workout..."
										autofocus
										bind:value={newWorkoutName}
										on:keydown={async (e) => {
											if (e.key === 'Enter') {
												await handleAddNewWorkout();
												showNewWorkoutPopout = false;
											}
										}}
									/>
									{#if !currentlWaitingForWorkoutSubmission}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											height="24px"
											viewBox="0 -960 960 960"
											width="24px"
											fill="#5f6368"
										>
											<path
												d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
											/>
										</svg>
									{:else}
										<div class="loading">
											<LoadingGraphic />
										</div>
									{/if}
								</div>
							{/if}
						</div>
					</div>
					{#each workouts as workout}
						{#if currentlyFilteredMuscleGroup === undefined || currentlyFilteredWorkoutIDs.includes(workout.id)}
							<Accordion
								workoutID={workout.id}
								workoutTitle={workout.name}
								exerciseNumber="{currentlyFilteredMuscleGroup
									? getNumberOfExercisesInWorkoutByMuscleGroup(
											workout.id,
											currentlyFilteredMuscleGroup
										) + ' / '
									: ''}{workout.exerciseList.length}"
								on:delete={() => {
									workouts = workouts.filter((w) => w.id !== workout.id);
								}}
							>
								<div class="workoutContent">
									{#each workout.exerciseList as excerciseID}
										{@const exercise = getExerciseById(excerciseID)}
										{#if exercise !== null}
											<div
												class="excercise {!currentlyFilteredExerciseIDs.includes(excerciseID) &&
												currentlyFilteredExerciseIDs.length > 0
													? 'inactive'
													: ''}"
											>
												<button
													class="delete"
													on:click={() => handleRemoveExerciseFromWorkout(workout.id, excerciseID)}
												>
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
											currentlySelectedExerciseIds = workout.exerciseList;
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
						{/if}
					{/each}

					{#if (currentlyFilteredMuscleGroup !== undefined && currentlyFilteredWorkoutIDs.length === 0) || !workouts.some((workout) => currentlyFilteredMuscleGroup === undefined || currentlyFilteredWorkoutIDs.includes(workout.id))}
						<div class="empty">Hmm, there's nothing here...</div>
					{/if}
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

<Modal bind:showModal={showAddNewExerciseModal}>
	{#if currentlyEditingWorkout}
		<div class="modalContent">
			<div class="title">
				Add new exercise to <span>
					{getWorkoutFromId(currentlyEditingWorkout).name}
				</span>
			</div>
			<div class="exercises">
				<div class="filter">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
						fill="#5f6368"
						><path
							d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z"
						/></svg
					>
					<input placeholder="Type to filter..." bind:value={currentFilterText} />
				</div>
				{#if currentlySelectedExerciseIds.length > 0}
					<div class="selectedExercisesList">
						{#each currentlySelectedExerciseIds as selectedExerciseId}
							<button
								class="exercise"
								on:click={() => {
									currentlySelectedExerciseIds = currentlySelectedExerciseIds.filter(
										(e) => e !== selectedExerciseId
									);
								}}
							>
								{getExerciseById(selectedExerciseId)?.name}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="24px"
									viewBox="0 -960 960 960"
									width="24px"
									fill="#5f6368"
									><path
										d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
									/></svg
								>
							</button>
						{/each}
					</div>
				{/if}
				<div class="exerciseList {currentlySelectedExerciseIds.length > 0 ? '' : 'full'}">
					{#each exercises
						.filter((e) => e.name.toLowerCase().includes(currentFilterText.toLowerCase()))
						.filter((e) => !currentlySelectedExerciseIds.includes(e.id))
						.sort((a, b) => a.name.localeCompare(b.name)) as exercise (exercise.id)}
						<button
							class="exercise"
							on:click={() => {
								currentlySelectedExerciseIds = [...currentlySelectedExerciseIds, exercise.id];
							}}
						>
							{exercise.name}
						</button>
					{/each}
				</div>
				<div class="buttons">
					<button
						class="confirm"
						on:click={async () => {
							await updateWorkout();
							currentlySelectedExerciseIds = [];
							currentFilterText = '';
							showAddNewExerciseModal = false;
						}}>Add</button
					>
					<button
						class="deny"
						on:click={() => {
							currentlySelectedExerciseIds = [];
							currentFilterText = '';
							showAddNewExerciseModal = false;
						}}>Cancel</button
					>
				</div>
			</div>
		</div>
	{:else}
		{@const _ = showAddNewExerciseModal = showAddNewExerciseModal}
		<div>howd you get here?</div>
	{/if}
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
			width: calc(65% - 18px);
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
			.addNewWorkout {
				position: relative;
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
				.popout {
					position: absolute;
					bottom: 0;
					right: 0;
					// transform: translateX(-100%);
					// width: 6em;
					// box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
					// display: flex;
					// flex-direction: row;
					svg,
					.loading {
						position: absolute;
						right: 0;
						height: 100%;
						width: auto;
						padding: 0.2em;
						box-sizing: border-box;
					}
					input {
						background-color: transparent;
						padding: 5px;
						font-size: 1.3em;
						color: white;
						border: none;
						border-bottom: 2px solid gray;
						&::placeholder {
							color: rgb(179, 179, 179);
							font-style: italic;
							font-size: 0.9em;
						}
						&:focus {
							outline: none;
							background: rgb(2, 0, 36);
							background: linear-gradient(
								0deg,
								rgba(2, 0, 36, 1) 0%,
								rgba(0, 12, 69, 0.5) 0%,
								rgba(0, 12, 69, 0) 100%
							);
						}
					}
				}
				&:hover {
					.add-workout-button {
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

			.empty {
				margin-top: 20px;
				width: 100%;
				text-align: center;
				color: gray;
				font-style: italic;
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
					color: white;
					background-color: #666;
					padding-left: 2.3em;
					display: flex;
					flex-direction: row;
					&.inactive {
						background-color: #313131;
						.name {
							color: rgb(146, 146, 146);
						}
					}
					.delete {
						cursor: pointer;
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
			width: calc(35% - 16px);
			min-height: 35vh;
			border-radius: 10px;
			.header {
				padding: 10px;
				padding-left: 15px;
				padding-bottom: 5px;
				width: 90%;
				border-bottom: 1px solid #616161;
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 1em;
				justify-content: space-between;
				svg {
					height: 1.2em;
					fill: white;
				}
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
					border: none;
					color: white;
					width: calc(50% - 10px);
					background-color: #666;
					border-radius: 13px;
					padding: 8px;
					box-sizing: border-box;
					text-align: center;
					cursor: pointer;
					&.active {
						background-color: #576096;
					}
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
		width: 40vw;
		height: 50vh;
		overflow: hidden;
		.title {
			width: 100%;
			text-align: center;
			color: white;
			font-size: 1.4em;
			padding-top: 20px;
			padding-top: 20px;
			span {
				color: rgb(158, 158, 252);
			}
		}
		.exercises {
			.filter {
				position: relative;
				display: flex;
				align-items: center;
				margin-left: 1em;
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
					width: 45%;
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

			// .selectedExercisesList {
			// 	max-height: 20vh;
			// 	display: flex;
			// 	flex-direction: row;
			// 	flex-wrap: wrap;
			// 	overflow-y: auto;
			// 	border-bottom: 2px solid white;
			// }
			.exerciseList,
			.selectedExercisesList {
				max-height: 20vh;
				overflow-y: auto;
				overflow-x: visible;
				position: relative;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				gap: 10px;
				padding-top: 20px;
				&.full {
					max-height: 40vh;
				}
				.exercise {
					font-size: 1.05em;
					min-width: fit-content;
					max-width: calc(50% - 10px);
					padding: 5px;
					background-color: #576096;
					border-radius: 5px;
					border: none;
					color: white;
					cursor: pointer;
					display: flex;
					flex-direction: row;
					align-items: center;
					svg {
						height: 1.3em;
						width: auto;
						fill: white;
					}
				}
			}
			.selectedExercisesList {
				border-bottom: 2px solid white;
				padding-bottom: 20px;
			}
			.buttons {
				width: 100%;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				gap: 20px;

				margin-top: 15px;
				button {
					color: white;
					border: none;
					font-size: 1.2em;
					padding: 7px;
					border-radius: 5px;
					width: 4em;
					cursor: pointer;
				}
				.confirm {
					background-color: rgb(136, 177, 224);
					&:hover {
						background-color: rgb(182, 204, 231);
					}
				}
				.deny {
					background-color: gray;
					&:hover {
						background-color: rgb(182, 182, 182);
					}
				}
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
