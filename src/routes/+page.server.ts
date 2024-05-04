import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';
export const load = (async () => {
	const prisma = new PrismaClient();
	let counter = 0;

	const result = await prisma.kvp.findUnique({
		where: { key: 'counter' },
		select: { value: true }
	});

	if (!result) {
		await prisma.kvp.create({
			data: { key: 'counter', value: '0' }
		});
	} else {
		counter = parseInt(result.value);
	}

	counter++;

	await prisma.kvp.update({
		where: { key: 'counter' },
		data: { value: counter.toString() }
	});

	return { counter, message: 'Hello from the server!' };
}) satisfies PageServerLoad;
