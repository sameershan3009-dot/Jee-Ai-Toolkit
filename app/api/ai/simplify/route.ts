import { NextResponse } from "next/server";

type SimplifyRequest = {
  doubt?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SimplifyRequest;
  const doubt = body.doubt?.trim();

  if (!doubt || doubt.length < 10) {
    return NextResponse.json(
      { error: "Please send a real doubt with at least 10 characters." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    mode: process.env.OPENAI_API_KEY ? "ai-ready" : "template",
    explanation: [
      "Identify what the question is asking before touching formulas.",
      "List the known quantities and the chapter concept involved.",
      "Choose the shortest valid method, then substitute values carefully.",
      "Check units, signs, and boundary cases before finalizing."
    ],
    note:
      "Add OPENAI_API_KEY later to replace this template response with real AI explanations."
  });
}
