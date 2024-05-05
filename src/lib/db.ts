import { PrismaClient, type World } from '@prisma/client';

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

export async function createWorld(name: string, description: string): Promise<World> {
	const rootTreeNode = await prisma.treeNode.create({
		data: { name: 'root' }
	});
	const rootRegion = await prisma.region.create({
		data: {
			name: name,
			description: 'root',
			x: 0,
			y: 0,
			width: 1,
			height: 1,
			level: 0,
			treeNode: { connect: { id: rootTreeNode.id } }
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
}

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

// generator client {
// 	provider = "prisma-client-js"
//   }

//   datasource db {
// 	provider = "postgresql"
// 	url      = env("DATABASE_URL")
//   }

//   // kvp table
//   model Kvp {
// 	id        String   @id @default(cuid())
// 	key       String   @unique
// 	value     String
// 	createdAt DateTime @default(now())
// 	updatedAt DateTime @updatedAt
//   }

//   // tree node using primary keys, DO NOT USE CUID

//   model TreeNode {
// 	id        Int      @id @default(autoincrement())
// 	parentId  Int?
// 	name      String
// 	createdAt DateTime @default(now())
// 	updatedAt DateTime @updatedAt

// 	parent   TreeNode?  @relation("ParentChild", fields: [parentId], references: [id])
// 	children TreeNode[] @relation("ParentChild")
// 	Region   Region?
//   }

//   model Region {
// 	id          Int      @id @default(autoincrement())
// 	treeNodeId  Int      @unique
// 	name        String
// 	description String
// 	createdAt   DateTime @default(now())
// 	updatedAt   DateTime @updatedAt
// 	x           Float
// 	y           Float
// 	width       Float
// 	height      Float
// 	level       Int

// 	treeNode TreeNode @relation(fields: [treeNodeId], references: [id])

// 	@@index([level])
//   }

//   model World {
// 	id           Int      @id @default(autoincrement())
// 	name         String   @unique
// 	description  String
// 	rootRegionId Int      @unique
// 	createdAt    DateTime @default(now())
// 	updatedAt    DateTime @updatedAt
//   }
