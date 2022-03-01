import type { RequestHandler } from '@sveltejs/kit';
import { registerUser } from './_db';
import { serialize } from 'cookie';

export const post: RequestHandler = async ({ request }) => {
	const items = await request.formData();
	const email = items.get('email').toString();
	const password = items.get('password').toString();

	console.log({ action: 'sign up' });

	const result = await registerUser({ email, password });

	if (result.success) {
		return {
			status: 200,
			headers: {
				'Set-Cookie': serialize('session_id', result.sessionId, {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge: 60 * 60 * 24 * 7 // one week
				})
			},
			body: {
				success: true,
				message: 'Successfully signed in'
			}
		};
	} else {
		return {
			status: 401,
			body: {
				success: false,
				message: 'Incorrect user or password'
			}
		};
	}
};
