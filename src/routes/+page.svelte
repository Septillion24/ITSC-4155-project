<script>
	let workouts = [
		{ title: 'Workout 1', content: 'Details for Workout 1' },
		{ title: 'Workout 2', content: 'Details for Workout 2' },
		{ title: 'Workout 3', content: 'Details for Workout 3' }
	];
	/**
	 * @type {number | null}
	 */
	let openWorkoutIndex = null;

	/**
	 * @param {number | null} index
	 */
	function toggleWorkout(index) {
		openWorkoutIndex = openWorkoutIndex === index ? null : index;
	}
</script>

<div class="wrapper">
	<header><img src="banner.png" alt="banner" /></header>
	<div class="container">
		<div class="workouts">
			<h4>WORKOUTS</h4>
			{#each workouts as workout, index}
				<div class="workout">
					<button on:click={() => toggleWorkout(index)}
						>{#if openWorkoutIndex === index}
							<img src="arrow_down.png" alt="" />
							{workout.title}
							{workout.content}
						{:else}
							<img src="arrow_right.png" alt="" />
							{workout.title}
						{/if}</button
					>
				</div>
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

		<div class="meal-plan">
			<h4>MEAL PLAN</h4>
			<p>Lunch 1: Beef Tacos</p>
			<p>Lunch 2: ...</p>
			<p>Dinner 1: ...</p>
		</div>

		<div class="workout-schedule">
			<h4>WORKOUT SCHEDULE</h4>
			<div class="schedule-day">Sun 08</div>
			<div class="schedule-day">Mon 09</div>
			<div class="schedule-day">...</div>
		</div>
	</div>
</div>

<style lang="scss">
	.wrapper {
		margin: 0;
		padding: 0;
		background-color: #616161;
		height: 100%;
		width: 100%;
		min-height: 100%;
		.container {
			background-color: #616161;
			color: white;
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
			width: max-content;
			margin: 0 auto;
			padding: 20px;
			min-height: 100%;
			row-gap: 10px;
			.workouts {
				margin: 8px;
				box-sizing: border-box;
				width: calc(50% - 16px);
				background-color: #444;
				border-radius: 10px;
				padding: 15px;
			}
			.muscle-groups {
				margin: 8px;

				box-sizing: border-box;
				width: calc(50% - 16px);
				background-color: #444;
				border-radius: 10px;
				padding: 15px;
			}
			.meal-plan {
				margin: 10px;

				box-sizing: border-box;
				display: none;
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
	}
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: Arial, sans-serif;
	}
	:global(body) {
		margin: 0;
		padding: 0;
	}

	body {
		margin: 0;
		padding: 0;
		background-color: #2f2f2f;
		color: #fff;
	}

	header {
		text-align: center;
		background-color: black;
		margin: 0;
		padding: 0;
		width: 100%;
	}

	header img {
		width: 500px;
	}

	h4 {
		border-bottom: 1px solid #616161;
		padding-bottom: 10px;
		margin-bottom: 10px;
	}
</style>
