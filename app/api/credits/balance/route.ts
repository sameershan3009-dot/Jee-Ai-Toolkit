import { NextResponse } from "next/server";
import { getCreditBalance, getStorageMode } from "@/lib/payment-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guestId = searchParams.get("guestId")?.trim();

  if (!guestId) {
    return NextResponse.json({ error: "Guest id is required." }, { status: 400 });
  }

  const credits = await getCreditBalance(guestId);

  return NextResponse.json({
    credits,
    storage: getStorageMode()
  });
}
