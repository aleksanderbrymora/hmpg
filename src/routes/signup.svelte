<script context="module" lang="ts">
	export async function load({ session }) {
		if (session?.user) {
			return {
				status: 302,
				redirect: '/'
			};
		} else return {};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { submit } from '$lib/useSubmit';
	import { autofocus } from '$lib/useAutofocus';

	let message = '';
</script>

<form
	use:submit={{
		onEnd: async (res) => {
			const data = await res.json();
			console.log({ data });
			if (data.success) goto('/');
			else message = data.message;
		}
	}}
	class="max-w-lg mx-auto mt-20 flex flex-col gap-4"
	action="/api/signup"
	method="post"
>
	<fieldset>
		<label for="email-input">Email</label>
		<input use:autofocus name="email" type="email" required id="email-input" value="a@a.co" />
	</fieldset>

	<fieldset>
		<label for="password-input">Password</label>
		<input name="password" type="password" required id="password-input" value="Chicken.123" />
	</fieldset>

	<p>Have an account already? <a class="text-blue-400" href="/login">Log in</a></p>

	{#if message !== ''}
		<p class="text-center">{message}</p>
	{/if}

	<input
		type="submit"
		value="Sign up"
		class="bg-white px-5 py-2 mt-5 rounded text-black text-lg font-bold w-min mx-auto"
	/>
</form>

<style lang="scss">
	fieldset {
		@apply flex flex-col gap-2 text-lg;

		input {
			@apply w-full p-2 rounded text-black;
		}

		label {
			@apply text-lg;
		}
	}
</style>
