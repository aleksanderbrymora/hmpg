import type { RequestHandler } from '@sveltejs/kit';
import { serialize } from 'cookie';
import { loginUser } from './_auth';

export const post: RequestHandler = async ({ request }) => {
	const items = await request.formData();
	const email = items.get('email').toString();
	const password = items.get('password').toString();

	const result = await loginUser({ email, password });

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
				message: 'Successfully signed in',
				email: result.email,
				id: result.id,
				success: true
			}
		};
	} else {
		return {
			status: 401,
			body: {
				message: 'Incorrect user or password',
				success: false
			}
		};
	}
};
