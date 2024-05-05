import { createWorld } from '$lib/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response();
};

interface PostParams {
	name: string;
}

export const POST = async ({ request }) => {
	const body = (await request.json()) as PostParams;
	const worldName = body.name;
	const world = await createWorld(worldName, 'A new world', 10000000, 10000000);

	return new Response(JSON.stringify(world), { status: 201 });
};
