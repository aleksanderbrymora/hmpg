<script context="module" lang="ts">
	import { autofocus } from '$lib/actions/useAutofocus';
	import { onMount } from 'svelte';

	export async function load({ session, fetch }) {
		if (!session?.user) {
			return {
				status: 302,
				redirect: '/login'
			};
		}
		const res = await fetch('/api/shortcuts.json');
		const { shortcuts } = (await res.json()) as { shortcuts: Shortcut[] };

		return {
			props: {
				shortcuts
			}
		};
	}
</script>

<script lang="ts">
	let search = '';
	export let shortcuts: Shortcut[];

	const focusOnInput = (e: KeyboardEvent) => {
		const input = document.getElementById('search');
		input.nodeValue = e.key;
		input.focus();
	};

	onMount(() => {
		document.body.addEventListener('keydown', focusOnInput);
		return () => document.body.removeEventListener('keydown', focusOnInput);
	});

	$: [short, query] = search.trim().split('|');
	$: found = shortcuts.find((s) => s.shortNames.includes(short));

	$: console.log({ found, short, query });

	const keydownHandler = (e: KeyboardEvent) => {
		if (e.key === 'Escape') search = '';
		if (e.key === 'Enter') {
			if (query && found.searchPage)
				window.open(found.searchPage.replace('$$query', query), '_blank');
			else if (found && !query) window.open(found.homepage, '_blank');
			else window.open(`https://duckduckgo.com/?t=ffab&q=${short}`, '_blank');
			search = '';
		}
	};
</script>

<input
	class="w-full text-8xl p-5 bg-transparent focus:outline-none text-center mt-36 overflow-x-auto"
	spellcheck="false"
	type="text"
	autocomplete="off"
	use:autofocus
	id="search"
	bind:value={search}
	on:keydown={keydownHandler}
/>
<label for="search" class="text-center w-full block">
	Just start typing in your shortcut <br />Press Enter to execute shortcut or Esc to erase field
</label>

<p
	class="block w-full text-3xl mt-10 text-center underline"
	style="text-decoration-color: {found?.color || 'none'};"
>
	{#if found && short && !query}
		Open {found.title}
	{:else if found && short && query && !found.searchPage}
		You haven't added search for this page, will just open {found.title}
	{:else if found && short && query && found.searchPage}
		Search for {query} in {found.title}
	{:else if !found && short}
		Search duckduckgo for {short}
	{/if}
</p>
