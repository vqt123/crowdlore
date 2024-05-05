import type { Region } from '@prisma/client';
import type { RequestHandler } from './$types';
import { getRegion, prisma, type RegionWithChildren } from '$lib/db';
import OpenAI from 'openai';
const openai = new OpenAI({
	apiKey: process.env.OPEN_AI_API_KEY
});

export const GET: RequestHandler = async () => {
	return new Response();
};

interface PostParams {
	region: Region;
}

export const POST = async ({ request }) => {
	console.log('POST /api/ai/description');
	const body = (await request.json()) as PostParams;
	let region = (await getRegion(body.region.id)) as RegionWithChildren;
	let regionAncestry = [];
	let parentId = region.parentId;
	while (true) {
		if (!parentId) break;

		const parent = await prisma.region.findFirst({
			where: {
				id: parentId
			}
		});
		regionAncestry.push(parent);

		parentId = parent?.parentId!;
	}

	region.description = '';
	const regionPrompt = `The following is data regarding a region. The data can represent the region at various zoom levels.
	1 unit is about 1 meter. What does it look like? What are the people like? What is the culture like?
	
	JsonObject: 
	${JSON.stringify(region, null, 2)}
	
	Ancstry:
	${JSON.stringify(regionAncestry, null, 2)}
`;
	const completion = await openai.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: 'You are a fictional world creative writer'
			},
			{ role: 'user', content: regionPrompt }
		],
		model: 'gpt-3.5-turbo'
	});

	const description = completion.choices[0].message.content as string;

	console.log(`prompt: ${regionPrompt} description: ${description}`);

	region.description = description;

	// write back to db
	region = (await prisma.region.update({
		where: {
			id: region.id
		},
		data: {
			description: description
		}
	})) as RegionWithChildren;

	return new Response(JSON.stringify(region), { status: 201 });
};
