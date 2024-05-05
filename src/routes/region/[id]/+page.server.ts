import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	// sveltekit params

	return { params };
}) satisfies PageServerLoad;
