import type { RequestHandler } from '@sveltejs/kit';
import { parse, serialize } from 'cookie';
import { signOutUser } from './_auth';

export const get: RequestHandler = async ({ request }) => {
	const cookies = parse(request.headers.get('cookie') || '');

	if (cookies.session_id) {
		await signOutUser(cookies.session_id);
	}

	return {
		status: 200,
		headers: {
			'Set-Cookie': serialize('session_id', '', {
				path: '/',
				expires: new Date(0)
			})
		}
	};
};
