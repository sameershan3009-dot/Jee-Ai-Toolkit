import { NextResponse } from "next/server";

type PlannerRequest = {
  dailyHours?: number;
  targetExam?: string;
  weakSubjects?: string[];
};

const fallbackSubjects = ["Physics", "Chemistry", "Maths"];

export async function POST(request: Request) {
  const body = (await request.json()) as PlannerRequest;
  const dailyHours = Math.max(1, Math.min(Number(body.dailyHours || 4), 12));
  const weakSubjects = body.weakSubjects?.length ? body.weakSubjects : fallbackSubjects;
  const slotMinutes = Math.max(35, Math.floor((dailyHours * 60) / 4));

  const plan = [
    {
      label: "Concept repair",
      subject: weakSubjects[0] ?? "Physics",
      duration: slotMinutes,
      task: "Revise notes and solve 8 direct concept questions."
    },
    {
      label: "PYQ practice",
      subject: weakSubjects[1] ?? "Chemistry",
      duration: slotMinutes,
      task: "Attempt a mixed PYQ set, then mark every careless error."
    },
    {
      label: "Speed block",
      subject: weakSubjects[2] ?? "Maths",
      duration: slotMinutes,
      task: "Solve timed problems with a strict skip rule."
    },
    {
      label: "Recall loop",
      subject: "Review",
      duration: Math.max(25, Math.floor(slotMinutes / 2)),
      task: "Update formula sheet and reattempt yesterday's wrong questions."
    }
  ];

  return NextResponse.json({
    targetExam: body.targetExam || "JEE Main",
    dailyHours,
    plan
  });
}
