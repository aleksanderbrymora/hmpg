<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ session }) => {
		console.log({ session });
		return {};
	};
</script>

<script>
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';

	const signOut = async () => {
		await fetch('/api/signout');
		$session = {};
		await goto('/login');
	};
</script>

<h1>sup</h1>
<button on:click={signOut}>Sign out</button>
