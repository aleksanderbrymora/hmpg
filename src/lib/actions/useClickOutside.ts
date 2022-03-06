export const clickOutside = (node: HTMLElement, cb: () => void) => {
	const handleOutsideClick = ({ target }) => {
		if (!node.contains(target)) cb();
	};
	document.body.addEventListener('click', handleOutsideClick);
	return {
		destroy() {
			document.body.removeEventListener('click', handleOutsideClick);
		}
	};
};
