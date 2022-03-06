// import { PrismaClient } from '@prisma/client';
// import argon from 'argon2';

// //! if I want to run the seed i need to remove `type: "module"` from package.json

// const db = new PrismaClient();

// const seed = async () => {
// 	await db.shortcut.deleteMany({});
// 	await db.session.deleteMany({});
// 	await db.user.deleteMany({});

// 	const email = 'a@a.co';
// 	const password = 'Chicken.123';

// 	const passwordHash = await argon.hash(password);
// 	const user = await db.user.create({ data: { email, passwordHash } });

// 	await db.shortcut.createMany({ data: urls.map((u) => ({ ...u, userId: user.id })) });
// };

// interface Shortcut {
// 	color: string;
// 	homepage: string;
// 	shortNames: string[];
// 	title: string;
// 	searchPage?: string;
// }

// const urls: Shortcut[] = [
// 	{
// 		homepage: 'https://www.youtube.com',
// 		shortNames: ['y', 'yt'],
// 		color: '#ff1a1a',
// 		title: 'YouTube',
// 		searchPage: 'https://www.youtube.com/results?search_query=$$query'
// 	},
// 	{
// 		homepage: 'https://www.github.com/aleksanderbrymora',
// 		shortNames: ['gh'],
// 		color: '#383838',
// 		title: 'Github Repos',
// 		searchPage: 'https://github.com/aleksanderbrymora?tab=repositories&q=$$query'
// 	},
// 	{
// 		homepage: 'http://localhost:3000',
// 		shortNames: ['l'],
// 		color: '#636363',
// 		title: 'localhost:3000'
// 	},
// 	{
// 		homepage: 'https://www.notion.so',
// 		shortNames: ['not', 'notion'],
// 		color: '#535353',
// 		title: 'notion'
// 	},
// 	{
// 		homepage: 'https://drive.google.com/drive/u/0/my-drive',
// 		shortNames: ['drive'],
// 		color: '#ffff37',
// 		title: 'drive'
// 	},
// 	{
// 		homepage: 'https://twitter.com/',
// 		shortNames: ['t'],
// 		color: '#37c3ff',
// 		title: 'Twitter'
// 	},
// 	{
// 		homepage: 'https://www.linkedin.com/feed/',
// 		shortNames: ['li'],
// 		color: '#5ab0f7',
// 		title: 'LinkedIn'
// 	},
// 	{
// 		homepage: 'https://mail.google.com/mail/u/1/#inbox',
// 		shortNames: ['mwork', 'm1'],
// 		color: '#cd3b2f',
// 		title: 'Work mail'
// 	},
// 	{
// 		homepage: 'https://mail.google.com/mail/u/0',
// 		shortNames: ['m', 'm0'],
// 		color: '#cd3b2f',
// 		title: 'Mail'
// 	},
// 	{
// 		homepage: 'https://calendar.google.com/calendar/u/0/r?tab=mc',
// 		shortNames: ['cal'],
// 		color: '#3f3fff',
// 		title: 'Calendar'
// 	},
// 	{
// 		homepage: 'https://www.figma.com',
// 		shortNames: ['figma', 'fig'],
// 		color: '#ad37ff',
// 		title: 'Figma'
// 	},
// 	{
// 		homepage: 'https://developer.mozilla.org/en-US/',
// 		shortNames: ['mdn', ';'],
// 		color: '#6a6a6a',
// 		title: 'MDN',
// 		searchPage: 'https://developer.mozilla.org/en-US/search?q=$$query'
// 	},
// 	{
// 		homepage: 'https://www.npmjs.com/',
// 		shortNames: ['npm'],
// 		color: '#c9305b',
// 		title: 'NPM',
// 		searchPage: 'https://www.npmjs.com/search?q=$$query'
// 	}
// ];

// seed()
// 	.catch((e) => {
// 		console.error(e);
// 		process.exit(1);
// 	})
// 	.finally(async () => {
// 		await db.$disconnect();
// 	});

// export default {};
