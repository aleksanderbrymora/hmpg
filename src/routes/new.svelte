<script context="module">
	export async function load({ session }) {
		if (!session?.user) {
			return {
				status: 302,
				redirect: '/'
			};
		} else return {};
	}
</script>

<script lang="ts">
	import { z } from 'zod';
	import { match, select } from 'ts-pattern';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { clickOutside } from '$lib/actions/useClickOutside';

	let title = 'Youtube';
	let color = '#222222';
	let shortNames = 'yt|y';
	let homepage = 'https://youtube.com';
	let searchLink: string;
	// let title = '';
	// let color = '';
	// let shortNames = '';
	// let homepage = '';
	// let searchLink = '';

	let fieldErrors: { [key: string]: string[] } = {};

	onMount(() => {
		const escRedirect = (e: KeyboardEvent) => {
			if (e.key === 'Escape') goto('/');
		};
		document.addEventListener('keydown', escRedirect);
		return () => document.removeEventListener('keydown', escRedirect);
	});

	const schema = z.object({
		title: z.string().min(1),
		color: z.string().regex(/#[abcdefABCDEF\d]{6}/),
		shortNames: z
			.string()
			.min(1)
			.transform((val) => val.split('|')),
		homepage: z.string().url(),
		searchLink: z.string().url().optional()
	});

	const onSubmit = () => {
		const data = { title, color, shortNames, homepage, searchLink };
		const result = schema.safeParse(data);
		match(result)
			.with({ success: true, data: select('data') }, async (parsed) => {
				const res = await fetch('/api/shortcuts.json', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(parsed)
				});
				goto('/');
			})
			.with({ success: false, error: select('error') }, ({ error }) => {
				console.error(error.flatten().fieldErrors);
			})
			.exhaustive();
	};
</script>

<form
	on:submit|preventDefault={onSubmit}
	class="relative flex flex-col gap-5 max-w-lg mx-auto p-10 bg-zinc-100 rounded-lg shadow-xl shadow-sky-500/25 max-h-[80vh] overflow-auto"
	use:clickOutside={() => goto('/')}
>
	<button type="button" class="absolute text-black right-2 top-2" on:click={() => goto('/')}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
	</button>
	<fieldset>
		<label for="title-input">Title</label>
		<input bind:value={title} type="text" id="title-input" required />
		{#if fieldErrors.title}
			<p>{fieldErrors.title?.join(', ')}</p>
		{/if}
	</fieldset>
	<fieldset>
		<details>
			<summary><label for="color-picker-input">Color</label></summary>
			<p>A color that will be visible when a shortcut is found for one of your websites</p>
		</details>
		<input bind:value={color} type="color" class="!p-0 h-10" id="color-picker-input" />
		{#if fieldErrors.color}
			<p>{fieldErrors.color?.join(', ')}</p>
		{/if}
	</fieldset>
	<fieldset>
		<details>
			<summary><label for="shortnames-input">Shortcuts</label></summary>
			<p>
				Shortcuts for the websites that you can input quicly and navigate to the full website. If
				you have multiple - eparate them with pipe '|' (I used this obscure symbol so you could use
				commas or periods in the shortcuts) otherwise just input one<br />
				Example for 'youtube.com': yt|y
			</p>
		</details>
		<input bind:value={shortNames} type="text" required id="shortnames-input" />
		{#if fieldErrors.shortNames}
			<p>{fieldErrors.shortNames?.join(', ')}</p>
		{/if}
	</fieldset>
	<fieldset>
		<details>
			<summary><label for="homepage-input">Homepage</label></summary>
			<p>
				A link to the page you're creating a shortcut to <br />
				Example: https://www.youtube.com/
			</p>
		</details>
		<input bind:value={homepage} required type="url" id="homepage-input" />
		{#if fieldErrors.homepage}
			<p>{fieldErrors.homepage?.join(', ')}</p>
		{/if}
	</fieldset>
	<p class="text-black ">Optional stuff</p>
	<fieldset>
		<details>
			<summary><label for="search-page-input">Search Url</label></summary>
			<p>
				Url used to search in the service. Replace search string with '$$query' <br />
				Example: https://www.youtube.com/results?search_query=$$query
			</p>
		</details>
		<input bind:value={searchLink} type="url" id="search-page-input" />
		{#if fieldErrors.searchLink}
			<p>{fieldErrors.searchLink?.join(', ')}</p>
		{/if}
	</fieldset>

	<button
		class="bg-zinc-900 font-bold py-3 rounded hover:bg-zinc-800 transition-colors"
		type="submit">Add</button
	>
	<small class="text-black text-center">Press escape to go back to the main page</small>
</form>

<style lang="scss">
	fieldset {
		@apply flex flex-col gap-2 text-xl text-black;

		input {
			@apply text-black p-2 w-full rounded bg-white border-2 border-zinc-900;
		}
	}
	details p {
		@apply text-base;
	}
</style>
