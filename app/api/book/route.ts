import { NextResponse } from "next/server";
import { createBooking } from "@/lib/actions";

export async function POST(req: Request) {
  const body = await req.json();
  const result = await createBooking(body);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result);
}
