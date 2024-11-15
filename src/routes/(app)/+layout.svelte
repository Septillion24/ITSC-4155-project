<div class="wrapper">
	<main>
		<header>
			<img src="banner.png" alt="banner" />
			<a href="/login"> Login </a>
		</header>
		<slot />
	</main>
</div>

<style lang="scss">
	.wrapper {
		min-height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		background-color: #616161;
		main {
			flex: 1;
			display: flex;
			flex-direction: column;
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
	}
</style>
