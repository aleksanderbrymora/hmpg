export const submit = (
	node: HTMLFormElement,
	options: { onEnd: (res: Response) => Promise<void> }
) => {
	let submitting = false;
	const handleSubmit = async (
		e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) => {
		e.preventDefault();

		if (submitting) return;
		submitting = true;

		try {
			const res = await fetch(node.action, {
				method: node.method,
				body: new FormData(node)
			});
			await options.onEnd(res);
		} catch (error) {
			// todo handle error
			console.error({ error });
		} finally {
			submitting = false;
		}
	};

	node.addEventListener('submit', handleSubmit);

	return {
		destroy: () => {
			node.removeEventListener('submit', handleSubmit);
		}
	};
};
