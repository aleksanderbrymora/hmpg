import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import argon from 'argon2';

const userSchema = z.object({
	email: z.string().email(),
	password: z.string()
});

const db = new PrismaClient();

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

	const passwordHash = await argon.hash(password);
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

	const isValidPassword = await argon.verify(user.passwordHash, password);
	if (!isValidPassword) return { success: false, message: 'Email or password are incorrect' };

	const session = await db.session.create({ data: { userId: user.id } });

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
