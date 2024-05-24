import { client, db } from "@/lib/db";
import { food } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { href } = new URL(request.url);
  const splitHref = href.split("/");
  const id = splitHref[splitHref.length - 1];

  const whereClause = sql`is_custom = FALSE AND id = ${id}`;

  const food_obj = (await db.select().from(food).where(whereClause))[0];

  return NextResponse.json({ food: food_obj });
}

export async function POST(request: Request) {
  const { href } = new URL(request.url);
  const splitHref = href.split("/");
  const id = splitHref[splitHref.length - 1];
  const body = await request.json();
  const whereClause = sql`id = ${id}`;

  await db
    .update(food)
    .set({ name: body.name, nlName: body.nlName })
    .where(whereClause);

  return new NextResponse();
}
