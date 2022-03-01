import type { Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import { getSession as getSessionFromApi } from './routes/api/_db';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = parse(event.request.headers.get('cookie') || '');

	console.log({ cookies });

	if (cookies.session_id) {
		const session = await getSessionFromApi(cookies.session_id);
		console.log({ cookies });
		if (session) {
			event.locals['user'] = { email: session.User.email, userId: session.User.id };
			return resolve(event);
		}
	}

	event.locals['user'] = null;
	return resolve(event);
};

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(request) {
	return request?.locals?.user
		? {
				user: {
					email: request.locals.user.email,
					id: request.locals.user.userId
				}
		  }
		: {};
}
