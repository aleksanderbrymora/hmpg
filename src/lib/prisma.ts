import type { PrismaClient as PrismaClientType } from '@prisma/client';
import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;

export let db: PrismaClientType;
if (import.meta.env.PROD) {
	db = new PrismaClient();
} else {
	if (!global.db) {
		global.db = new PrismaClient();
	}
	db = global.db as PrismaClientType;
}
