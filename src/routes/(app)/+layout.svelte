<script lang="ts">
	import { onMount } from 'svelte';
	import type { User } from '../../classes/User';

	let currentUser: User | undefined;
	onMount(async () => {
		currentUser = await fetch('/api/get/user', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => res.json());
	});
</script>

<div class="wrapper">
	<main>
		<header>
			<div class="logo">
				<img src="banner.png" alt="banner" />
			</div>
			<div class="navButtons">
				<a href="/"> Home </a>
				<a href="/exercise"> Exercises </a>
				<!-- <a href="/login"> Login </a> -->
			</div>
			<div class="profile">
				{#if currentUser}
					<div>
						{currentUser.first_name}
					</div>
				{:else}
					<a href="/login"> Login </a>
				{/if}
			</div>
		</header>
		<slot />
	</main>
</div>

<style lang="scss">
	:global(body) {
		margin: 0;
		padding: 0;
	}
	.wrapper {
		min-height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		background-color: #202020;
		main {
			flex: 1;
			display: flex;
			flex-direction: column;
		}

		header {
			text-align: center;
			margin: 0;
			padding: 0;
			width: 100%;
			display: flex;
			justify-content: space-between;
			background: linear-gradient(
				180deg,
				rgba(2, 0, 36, 1) 0%,
				rgba(0, 0, 0, 0.5) 0%,
				rgba(0, 0, 0, 0) 100%
			);
			.logo {
				width: 19vw;
				img {
					width: 100%;
					height: auto;
					max-height: 200px;
				}
			}
			.navButtons {
				font-size: 1.3em;
				width: 60vw;
				display: flex;
				justify-content: space-around;
				a {
					padding: 8px;
					color: white;
					text-decoration: none;
					font-family: sans-serif;
					background-color: #434452;
					border-radius: 12px;
					margin-top: auto;
					margin-bottom: auto;
					border: 1px solid #9699a8;
					&:hover {
						text-decoration: underline;
						background-color: #7e809b;
					}
				}
			}
			.profile {
				font-size: 1.3em;
				display: flex;
				justify-content: center;
				width: 19vw;
				a {
					padding: 8px;
					color: white;
					text-decoration: none;
					font-family: sans-serif;
					background-color: #555dc9;
					border-radius: 12px;
					margin-top: auto;
					margin-bottom: auto;
					border: 1px solid #7f8fdd;
					&:hover {
						text-decoration: underline;
						background-color: #6c73d6;
					}
				}
			}
		}

		header img {
			width: 500px;
		}
	}
</style>
