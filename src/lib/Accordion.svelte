<script lang="ts">
	export let isOpen = false;
	export let workoutTitle;
	export let exerciseNumber;

	function toggleOpen() {
		isOpen = !isOpen;
	}
</script>

<div class="wrapper">
	<button class="accordionButton" on:click={toggleOpen}>
		<div class="workout">
			<div class="icon {isOpen ? 'open' : ''}">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="#FFFFFF"
				>
					<path d="M480-360 280-560h400L480-360Z" />
				</svg>
			</div>
			<div class="excerciseName">{workoutTitle}</div>
			<div class="excerciseNumber">
				<p>{exerciseNumber}</p>
			</div>
		</div>
	</button>
	<div class="accordionContent {isOpen ? 'active' : ''}">
		<slot />
	</div>
</div>

<style lang="scss">
	.wrapper {
		width: 100%;
		.accordionButton {
			background-color: transparent;
			border: none;
			padding: none;
			width: 100%;
			.workout {
				padding: 5px;
				width: 100%;
				border-bottom: 1px solid #616161;
				display: flex;
				flex-wrap: wrap;
				flex-direction: row;
				align-items: center;
				.icon {
					padding: 5px;
					transition: 0.2s;
					transform: rotate(-90deg);
					&.open {
						transition: 0.2s;
						transform: rotate(0deg);
					}
				}
				.excerciseName {
					font-size: 11pt;
					padding: 5px;
					color: lightgray;
					font-family: sans-serif;
				}
				.excerciseNumber {
					padding: 5px;
					color: #616161;
				}
			}
		}
		.accordionContent {
			width: 100%;
			&.active {
				display: block;
			}
			display: none;
		}
		.buttonContent {
			width: 100%;
		}
		.content {
			width: 100%;
		}
	}
</style>
