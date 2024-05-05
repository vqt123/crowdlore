import { prisma } from '$lib/db';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	// sveltekit params
	const worlds = await prisma.world.findMany();
	return { params, worlds };
}) satisfies PageServerLoad;
