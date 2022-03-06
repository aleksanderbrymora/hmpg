import { PrismaClient } from '@prisma/client';

export let db;
if (import.meta.env.PROD) {
	db = new PrismaClient();
} else {
	if (!global.db) {
		global.db = new PrismaClient();
	}
	db = global.db;
}
