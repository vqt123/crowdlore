import { getRegion, populateRegion } from '$lib/db';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	// sveltekit params
	const regionId = parseInt(params.id);
	let region = await getRegion(regionId);
	if (region?.children.length == 0) {
		region = await populateRegion(regionId);
	}

	return { region };
}) satisfies PageServerLoad;
