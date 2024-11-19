<script lang="ts">
	async function redirectToGoogleLoginPage() {
		const redirectURL = await fetch('/api/get/loginURL')
			.then((response) => response.json())
			.then((data) => (window.location = data));
	}
</script>

<div class="content">
	<button on:click={redirectToGoogleLoginPage}>Login</button>
</div>

<style lang="scss">
</style>
