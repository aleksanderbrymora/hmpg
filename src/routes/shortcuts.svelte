<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { clickOutside } from '$lib/actions/useClickOutside';
	import { goto } from '$app/navigation';

	export const load = async ({ fetch, session }) => {
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
	};
</script>

<script lang="ts">
	export let shortcuts: Shortcut[];
</script>

<!-- <pre>
	{JSON.stringify(shortcuts, null, 2)}
</pre> -->

<div
	use:clickOutside={() => goto('/')}
	class="relative grid grid-cols-2 md:grid-cols-4 gap-5 max-w-3xl mx-auto p-10 mt-20 bg-zinc-100 rounded-lg shadow-xl shadow-sky-500/25 max-h-[80vh] overflow-auto"
>
	<button class="absolute text-black right-2 top-2" on:click={() => goto('/')}>
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
	{#each shortcuts as s}
		<a
			href={s.homepage}
			class="p-3 flex place-content-center border-2 rounded-lg font-bold shadow text-black whitespace-nowrap border-opacity-75 bg-white"
			style="border-color: {s.color};"
		>
			{s.title}
		</a>
	{:else}
		<p class="text-black col-span-6 text-center font-bold">
			You don't have any shortcuts yet... <a class="text-blue-400" href="/new">Add one!</a>
		</p>
	{/each}
</div>
