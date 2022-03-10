import { z } from 'zod';
import { hash, verify } from 'argon2';
import { parse } from 'cookie';
import { db } from '$lib/prisma';

const userSchema = z.object({
	email: z.string().email(),
	password: z.string()
});

type AuthResult =
	| {
			success: true;
			email: string;
			id: string;
			sessionId: string;
	  }
	| {
			success: false;
			message: string;
	  };

export const registerUser = async ({
	email,
	password
}: {
	email: string;
	password: string;
}): Promise<AuthResult> => {
	const userValidation = userSchema.safeParse({ email, password });
	if (!userValidation.success)
		return { success: false, message: 'Email or password are incorrect' };

	const userExists = await db.user.findUnique({ where: { email } });
	if (userExists) return { success: false, message: 'Email or password are incorrect' };

	const passwordHash = await hash(password);
	const user = await db.user.create({ data: { email, passwordHash } });
	const session = await db.session.create({ data: { userId: user.id } });
	return { success: true, email: user.email, id: user.id, sessionId: session.id };
};

export const loginUser = async ({
	email,
	password
}: {
	email: string;
	password: string;
}): Promise<AuthResult> => {
	const parsedUser = userSchema.safeParse({ email, password });

	if (parsedUser.success === false)
		return { success: false, message: 'Email or password are incorrect' };

	const user = await db.user.findFirst({ where: { email: parsedUser.data.email } });
	if (!user) return { success: false, message: 'Email or password are incorrect' };

	const isValidPassword = await verify(user.passwordHash, password);
	if (!isValidPassword) return { success: false, message: 'Email or password are incorrect' };

	const session = await db.session.upsert({
		create: { userId: user.id },
		update: { userId: user.id },
		where: { userId: user.id }
	});

	return { success: true, email: user.email, id: user.id, sessionId: session.id };
};

export const signOutUser = async (sessionId: string) => {
	await db.session.delete({ where: { id: sessionId } });
	return { success: true };
};

export const getSession = async (sessionId: string) => {
	try {
		const session = await db.session.findUnique({
			where: { id: sessionId },
			select: {
				User: { select: { email: true, id: true } },
				id: true
			}
		});
		return session;
	} catch (error) {
		return null;
	}
};

export const getUserIdFromRequest = async (request: Request) => {
	const cookie = parse(request.headers.get('cookie') || '');
	const session = await getSession(cookie.session_id);
	return session.User.id;
};

export const createShortcut = async ({
	title,
	color,
	shortNames,
	homepage,
	searchLink,
	userId
}: {
	title: string;
	color: string;
	shortNames: string[];
	homepage: string;
	searchLink?: string;
	userId: string;
}) => {
	const shortcut = await db.shortcut.create({
		data: {
			color,
			homepage,
			title,
			User: { connect: { id: userId } },
			searchPage: searchLink,
			shortNames: shortNames
		}
	});
	return shortcut;
};
