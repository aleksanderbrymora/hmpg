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

	const userExists = await db.user.findFirst({ where: { email } });
	if (userExists) return { success: false, message: 'Email or password are incorrect' };

	const passwordHash = await argon.hash(password);
	const user = await db.user.create({ data: { email, passwordHash } });
	const session = await db.session.create({ data: { userId: user.id } });
	return { success: true, sessionId: session.id };
};
