import { NextResponse } from "next/server";

type PredictorRequest = {
  marks?: number;
  accuracy?: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as PredictorRequest;
  const marks = Math.max(0, Math.min(Number(body.marks || 120), 300));
  const accuracy = Math.max(0, Math.min(Number(body.accuracy || 65), 100));
  const band =
    marks >= 240
      ? "Top percentile track"
      : marks >= 180
        ? "Strong NIT/IIIT track"
        : marks >= 120
          ? "Needs consistency push"
          : "Foundation repair needed";

  return NextResponse.json({
    marks,
    accuracy,
    band,
    nextMove:
      accuracy < 70
        ? "Reduce negative attempts before increasing speed."
        : "Raise question volume while preserving accuracy."
  });
}
