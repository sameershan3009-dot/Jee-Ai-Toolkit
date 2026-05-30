"use client";

import { useState } from "react";

type PlannerResult = {
  plan: Array<{ label: string; subject: string; duration: number; task: string }>;
};

type PyqResult = {
  average: number;
  trend: string;
  priorityTopics: Array<{ topic: string; frequency: string; difficulty: string; action: string }>;
};

type PredictorResult = {
  band: string;
  nextMove: string;
};

type SimplifyResult = {
  explanation: string[];
  note: string;
};

export default function ToolkitLab() {
  const [active, setActive] = useState("planner");
  const [result, setResult] = useState<PlannerResult | PyqResult | PredictorResult | SimplifyResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  async function runTool() {
    setIsLoading(true);

    const payloads = {
      planner: {
        url: "/api/planner/generate",
        body: { dailyHours: 5, weakSubjects: ["Physics", "Organic Chemistry", "Maths"] }
      },
      pyq: {
        url: "/api/pyq/analyze",
        body: { topics: ["Electrostatics", "GOC", "Limits"], scores: [42, 58, 71] }
      },
      predictor: {
        url: "/api/predict-rank",
        body: { marks: 168, accuracy: 72 }
      },
      simplify: {
        url: "/api/ai/simplify",
        body: {
          doubt:
            "Why does electric potential remain constant inside a conductor in electrostatic equilibrium?"
        }
      }
    } as const;

    const selected = payloads[active as keyof typeof payloads];
    const response = await fetch(selected.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected.body)
    });

    setResult(await response.json());
    setIsLoading(false);
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-medium text-neutral-500">Live tools</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Try the working MVP APIs
          </h2>
          <p className="mt-4 text-sm leading-7 text-neutral-600">
            These are cost-safe logic/template tools. The doubt simplifier is ready to switch to a
            real AI model when you add an AI provider key.
          </p>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white/80 p-5 shadow-soft backdrop-blur">
          <div className="grid gap-2 sm:grid-cols-4">
            {[
              ["planner", "Planner"],
              ["pyq", "PYQ"],
              ["predictor", "Predictor"],
              ["simplify", "Simplify"]
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActive(id);
                  setResult(null);
                }}
                className={`h-10 rounded-full text-sm font-medium transition ${
                  active === id
                    ? "bg-neutral-950 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={runTool}
            disabled={isLoading}
            className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60"
          >
            {isLoading ? "Running..." : "Run selected tool"}
          </button>

          <div className="mt-5 min-h-48 rounded-2xl bg-neutral-950 p-5 text-sm text-white">
            {!result ? (
              <p className="text-white/60">Choose a tool and run it to see a generated result.</p>
            ) : (
              <pre className="whitespace-pre-wrap break-words font-sans leading-6 text-white/85">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
