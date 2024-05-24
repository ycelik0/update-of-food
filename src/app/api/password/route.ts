import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  return new NextResponse(undefined, {
    status: body.password === process.env.WEBSITE_PASSWORD ? 200 : 401,
  });
}
