import { PrismaClient, type Region, type World } from '@prisma/client';

export const prisma = new PrismaClient();

// generic kvpGet
export async function kvpGet(key: string): Promise<string | undefined> {
	const result = await prisma.kvp.findUnique({
		where: { key },
		select: { value: true }
	});
	return result?.value;
}

// generic kvpSet
export async function kvpSet(key: string, value: string): Promise<void> {
	await prisma.kvp.upsert({
		where: { key },
		update: { value },
		create: { key, value }
	});
}

interface RegionWithChildren extends Region {
	children: Region[];
}

export const getRegion = async (regionId: number): Promise<RegionWithChildren | null> => {
	const region = await prisma.region.findUnique({
		where: { id: regionId },
		include: { children: true }
	});

	return region;
};

export const populateRegion = async (regionId: number): Promise<RegionWithChildren> => {
	const region = await prisma.region.findUnique({
		where: { id: regionId },
		include: { children: true }
	});

	if (region?.children.length == 0) {
		// make 5 children of 1/5th the width from -width/2 to width/2 and -height/2 to height/2
		const width = region.width / 5;
		const height = region.height / 5;
		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
				const child = await prisma.region.create({
					data: {
						parentId: regionId,
						breadcrumb: `${region.breadcrumb} ${i},${j}`,
						name: `Region ${i},${j}`,
						description: `Region ${i},${j}`,
						x: region.x - region.width / 2 + i * width + width / 2,
						y: region.y - region.height / 2 + j * height + height / 2,
						width,
						height,
						level: region.level + 1
					}
				});

				region.children.push(child);
			}
		}
	}

	return region!;
};

export const createWorld = async (
	name: string,
	description: string,
	width: number,
	height: number
): Promise<World> => {
	const rootRegion = await prisma.region.create({
		data: {
			name: 'Root',
			description: 'Root region',
			breadcrumb: 'Root',
			x: 0,
			y: 0,
			width,
			height,
			level: 0
		}
	});

	const world = await prisma.world.create({
		data: {
			name,
			description,
			rootRegionId: rootRegion.id
		}
	});

	return world;
};

// interface MyRegion extends Region

/*
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// kvp table
model Kvp {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Region {
  id          Int      @id @default(autoincrement())
  parentId    Int?
  children    Region[] @relation("ParentChild")
  breadcrumb  String
  name        String
  description String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  x           Float
  y           Float
  width       Float
  height      Float
  level       Int

  parent Region? @relation("ParentChild", fields: [parentId], references: [id])
  World  World?

  @@index([parentId])
  @@index([level])
}

model World {
  id           Int      @id @default(autoincrement())
  name         String
  description  String
  rootRegionId Int      @unique
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  rootRegion Region @relation(fields: [rootRegionId], references: [id])
}

*/
