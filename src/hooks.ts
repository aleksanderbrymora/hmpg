/* eslint-disable @typescript-eslint/ban-ts-comment */

// Plenty of ts-ignore because `locals` doesn't support overwriting properties for some reason

import type { GetSession, Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import { getSession as getSessionFromApi } from './routes/api/_auth';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = parse(event.request.headers.get('cookie') || '');

	if (cookies.session_id) {
		const session = await getSessionFromApi(cookies.session_id);

		if (session) {
			// @ts-ignore
			event.locals.user = {
				email: session.User.email,
				userId: session.User.id
			};
			return resolve(event);
		}
	}

	// @ts-ignore
	event.locals.user = null;
	return resolve(event);
};

export const getSession: GetSession = (request) => {
	// @ts-ignore
	return request?.locals?.user
		? {
				user: {
					// @ts-ignore
					email: request.locals.user.email,
					// @ts-ignore
					id: request.locals.user.userId
				}
		  }
		: {};
};
