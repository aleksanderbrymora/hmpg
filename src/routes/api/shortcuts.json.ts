import type { RequestHandler } from '@sveltejs/kit';
import { createShortcut, getUserIdFromRequest } from './_auth';
import { db } from '$lib/prisma';

export const post: RequestHandler = async ({ request }) => {
	const userId = await getUserIdFromRequest(request);

	const { data } = (await request.json()) as {
		data: {
			title: string;
			color: string;
			shortNames: string[];
			homepage: string;
			searchLink?: string;
		};
	};

	await createShortcut({ ...data, userId });

	return {
		status: 200
	};
};

export const get: RequestHandler = async ({ request }) => {
	const userId = await getUserIdFromRequest(request);
	const shortcuts = await db.shortcut.findMany({
		where: { userId },
		select: {
			color: true,
			homepage: true,
			shortNames: true,
			id: true,
			title: true,
			searchPage: true
		}
	});

	return {
		body: { shortcuts }
	};
};
