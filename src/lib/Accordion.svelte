<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';

	export let isOpen = false;
	export let workoutTitle;
	export let exerciseNumber;
	export let workoutID: number;

	let deleteConfirmWindowOpen = false;

	let dispatch = createEventDispatcher();

	function toggleOpen() {
		isOpen = !isOpen;
	}

	function showDeleteConfirmWindow() {
		deleteConfirmWindowOpen = true;
	}

	async function handleDeleteWorkout() {
		const response = await fetch('/api/delete/workout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: workoutID
			})
		});
		deleteConfirmWindowOpen = false;
		dispatch('delete');
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
			<button class="delete" on:click={() => showDeleteConfirmWindow()}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="#5f6368"><path d="M200-440v-80h560v80H200Z" /></svg
				>
				<div class="text">Remove?</div>
			</button>
		</div>
	</button>
	<div class="accordionContent {isOpen ? 'active' : ''}">
		<slot />
	</div>
</div>

<Modal bind:showModal={deleteConfirmWindowOpen}>
	<div class="modalContent">
		<div class="main">Are you sure you want to remove this?</div>
		<div class="sub">All the exercises will still exist, but this workout plan wont...</div>
		<div class="buttons">
			<button class="confirm" on:click={handleDeleteWorkout}>Yes, delete it</button>
			<button class="deny" on:click={() => (deleteConfirmWindowOpen = false)}>No, go back</button>
		</div>
	</div>
</Modal>

<style lang="scss">
	.wrapper {
		width: 100%;
		.accordionButton {
			background-color: transparent;
			border: none;
			padding: none;
			width: 100%;
			.workout {
				position: relative;
				padding: 5px;
				width: 100%;
				border-bottom: 1px solid #616161;
				display: flex;
				flex-wrap: wrap;
				flex-direction: row;
				align-items: center;
				&:hover {
					.delete {
						visibility: visible;
					}
				}
				.delete {
					visibility: hidden;
					cursor: pointer;
					position: absolute;
					right: 0;
					top: 0;
					width: 2em;
					background-color: rgba(141, 141, 141, 0.253);
					height: 100%;
					margin-top: -1px;
					// margin-top: 5%;
					// margin-bottom: auto;
					border: none;
					// border-radius: 15px;
					align-items: left;
					text-align: left;
					overflow: hidden;
					display: flex;
					flex-direction: row;
					&:hover {
						transition: 400ms;
						width: 2.6em;
						background-color: rgb(190, 0, 0);
						border-top-right-radius: 0;
						border-bottom-right-radius: 0;
						border-top-right-radius: 0;
						border-bottom-right-radius: 0;
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
	.modalContent {
		width: 35vw;
		height: 17vh;
		padding-top: 5vh;
		color: white;
		.main {
			width: 100%;
			text-align: center;
			color: white;
			font-size: 1.9em;
		}
		.sub {
			font-size: 1.2em;
			text-align: center;
			color: rgb(146, 146, 146);
			font-style: italic;
			margin-top: 12px;
		}
		.buttons {
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: center;
			padding-top: 20px;
			gap: 20px;
			button {
				font-size: 1.2em;
				font-weight: bold;
				border: none;
				color: rgb(233, 233, 233);
				padding: 6px;
				padding-left: 6px;
				padding-right: 6px;
				border-radius: 5px;
				cursor: pointer;
			}
			.confirm {
				background-color: rgb(175, 0, 0);
			}
			.deny {
				background-color: rgb(112, 112, 112);
			}
		}
	}
</style>
