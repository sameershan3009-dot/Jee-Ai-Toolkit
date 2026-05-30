import { NextResponse } from "next/server";

type PyqRequest = {
  topics?: string[];
  scores?: number[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as PyqRequest;
  const topics = body.topics?.length
    ? body.topics
    : ["Electrostatics", "GOC", "Limits", "Matrices", "Thermodynamics"];
  const scores = body.scores?.length ? body.scores : [42, 58, 66, 71];
  const average = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);

  return NextResponse.json({
    average,
    trend: scores.at(-1)! >= scores[0] ? "improving" : "needs attention",
    priorityTopics: topics.slice(0, 3).map((topic, index) => ({
      topic,
      frequency: ["High", "Medium", "Medium"][index],
      difficulty: ["Moderate", "High", "Moderate"][index],
      action: index === 0 ? "Revise formulas and solve 15 PYQs" : "Add to next weekly practice set"
    }))
  });
}
