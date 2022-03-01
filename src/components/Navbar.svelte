<script>
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';

	const signOut = async () => {
		await fetch('/api/signout');
		$session = {};
		await goto('/login');
	};
</script>

<nav class="flex items-center justify-end py-4 gap-5">
	{#if $session['user']}
		<button on:click={signOut}>Sign out</button>
	{:else}
		<a href="/login">Log in</a>
		<a href="/signup">Sign up</a>
	{/if}
</nav>
