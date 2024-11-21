<script lang="ts">
	async function redirectToGoogleLoginPage() {
		const redirectURL = await fetch('/api/get/loginURL')
			.then((response) => response.json())
			.then((data) => (window.location = data));
	}
</script>

<div class="login">
	<button on:click={redirectToGoogleLoginPage}>Login</button>
</div>

<style lang="scss">
	.login {
		width: 100%;
		display: flex;
		justify-content: center;
		button {
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
</style>
