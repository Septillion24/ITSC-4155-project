<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let showModal: boolean;
	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();
	$: if (dialog !== undefined && !showModal) closeModal();
	const dispatch = createEventDispatcher();

	onMount(() => {
		document.addEventListener('keydown', closeOnEscape);
	});

	function closeOnEscape(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	function closeModal() {
		dialog.close();
		showModal = false;
		dispatch('close');
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:click|self={closeModal}>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div>
		<!-- svelte-ignore a11y-autofocus -->
		<button autofocus on:click={closeModal} class="closeButton">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="25px"
				viewBox="0 -960 960 960"
				width="25px"
				fill="#5f6368"
				><path
					d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z"
				/></svg
			>
		</button>

		<slot name="header" />
		<slot />
		<!-- svelte-ignore a11y-autofocus -->
	</div>
</dialog>

<style lang="scss">
	.closeButton {
		background: none;
		border: none;
		padding: 0;
		font-size: 20pt;
		cursor: pointer;
	}
	dialog {
		// overflow: visible;
		max-width: 70vw;
		max-height: 80vh;
		border-radius: 0.4em;
		border: none;
		padding: 20px;
		background-color: #444;
		color: rgb(228, 228, 228);
		font-family: sans-serif;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		animation: zoom-out 250ms cubic-bezier(0.34, 1.56, 0.64, 1);

		&:focus {
			outline: none;
		}

		&::backdrop {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			// background: rgba(0, 0, 0, 0);
			animation: fade-out 1s ease-out;
		}
		&[open] {
			animation: zoom 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
		}
		&[open]::backdrop {
			background: rgba(0, 0, 0, 0.3);
			animation: fade 0.25s ease-out;
		}
		div {
			padding: 1em;
		}
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes fade-out {
		from {
			opacity: 1;
			background: (0, 0, 0, 0.3);
			display: block;
		}
		to {
			background: (0, 0, 0, 0);
			opacity: 0;
		}
	}
	@keyframes zoom-out {
		from {
			transform: scale(1);
			display: block;
		}
		to {
			transform: scale(0.95);
		}
	}
</style>
