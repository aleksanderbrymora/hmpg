<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ url }) => ({ props: { url } });
</script>

<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.css';
	import PageTransition from '$lib/components/PageTransition.svelte';
	export let url: string;
</script>

<div class="container mx-auto px-5">
	<Navbar />
	<PageTransition {url}>
		<slot />
	</PageTransition>
</div>
