"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultTasks, formulaSheets, organicOrders, pyqTopics } from "@/lib/jee-data";

type Profile = {
  name: string;
  email: string;
  grade: string;
  targetYear: string;
};

type PlanItem = {
  label: string;
  subject: string;
  duration: number;
  task: string;
};

type RankResult = {
  band: string;
  nextMove: string;
  marks: number;
  accuracy: number;
};

const tabs = [
  "Overview",
  "Doubts",
  "Formulas",
  "Planner",
  "PYQ",
  "Pomodoro",
  "Rank",
  "Organic"
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function DashboardApp() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [doneTasks, setDoneTasks] = useState<string[]>([]);
  const [dailyHours, setDailyHours] = useState(5);
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [doubt, setDoubt] = useState("");
  const [doubtAnswer, setDoubtAnswer] = useState<string[]>([]);
  const [marks, setMarks] = useState(150);
  const [accuracy, setAccuracy] = useState(70);
  const [rankResult, setRankResult] = useState<RankResult | null>(null);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [sessions, setSessions] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedProfile = window.localStorage.getItem("jee-ai-profile");
    const savedTasks = window.localStorage.getItem(`jee-ai-done-${todayKey()}`);
    const savedSessions = window.localStorage.getItem(`jee-ai-sessions-${todayKey()}`);

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile) as Profile);
    }

    if (savedTasks) {
      setDoneTasks(JSON.parse(savedTasks) as string[]);
    }

    if (savedSessions) {
      setSessions(Number(savedSessions));
    }
  }, []);

  const completion = Math.round((doneTasks.length / defaultTasks.length) * 100);

  const highPriorityTopics = useMemo(
    () => [...pyqTopics].sort((a, b) => b.weight - a.weight).slice(0, 4),
    []
  );

  function toggleTask(task: string) {
    const next = doneTasks.includes(task)
      ? doneTasks.filter((item) => item !== task)
      : [...doneTasks, task];

    setDoneTasks(next);
    window.localStorage.setItem(`jee-ai-done-${todayKey()}`, JSON.stringify(next));
  }

  async function generatePlan() {
    setMessage("Generating plan...");
    const response = await fetch("/api/planner/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dailyHours,
        targetExam: profile?.targetYear,
        weakSubjects: ["Physics", "Organic Chemistry", "Maths"]
      })
    });
    const result = await response.json();

    setPlan(result.plan ?? []);
    setMessage("Plan ready.");
  }

  async function simplifyDoubt() {
    if (doubt.trim().length < 10) {
      setMessage("Write a fuller doubt first.");
      return;
    }

    setMessage("Simplifying doubt...");
    const response = await fetch("/api/ai/simplify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doubt })
    });
    const result = await response.json();

    setDoubtAnswer(result.explanation ?? []);
    setMessage("Doubt simplified.");
  }

  async function predictRank() {
    setMessage("Predicting band...");
    const response = await fetch("/api/predict-rank", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marks, accuracy })
    });
    const result = await response.json();

    setRankResult(result);
    setMessage("Prediction ready.");
  }

  function logSession() {
    const next = sessions + 1;

    setSessions(next);
    window.localStorage.setItem(`jee-ai-sessions-${todayKey()}`, String(next));
    setMessage(`Logged ${focusMinutes} minute focus session.`);
  }

  if (!profile) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-950">
          Your dashboard is waiting.
        </h1>
        <p className="mt-4 leading-7 text-neutral-600">
          Create a local profile first. It takes a few seconds and works without paid services.
        </p>
        <a
          href="/login"
          className="mt-6 inline-flex h-12 w-fit items-center rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white"
        >
          Start
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <header className="border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="text-sm font-semibold text-neutral-950">
            JEE AI Toolkit
          </a>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-neutral-500 sm:inline">{profile.targetYear}</span>
            <a
              href="/#credits"
              className="rounded-full bg-neutral-950 px-4 py-2 font-medium text-white"
            >
              Credits
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-5 lg:grid-cols-[15rem_1fr]">
        <aside className="h-fit rounded-lg border border-black/10 bg-white p-3">
          <div className="px-3 py-2">
            <p className="text-xs text-neutral-500">Signed in as</p>
            <p className="mt-1 text-sm font-semibold text-neutral-950">{profile.name}</p>
          </div>
          <nav className="mt-3 grid gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`h-10 rounded-lg px-3 text-left text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-neutral-950 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </aside>

        <section className="grid gap-5">
          <div className="rounded-lg border border-black/10 bg-white p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm text-neutral-500">{profile.grade}</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
                  {activeTab}
                </h1>
              </div>
              {message ? (
                <p className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-600">
                  {message}
                </p>
              ) : null}
            </div>
          </div>

          {activeTab === "Overview" ? (
            <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
              <section className="rounded-lg border border-black/10 bg-white p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-neutral-950">Today</h2>
                  <span className="text-sm text-neutral-500">{completion}% complete</span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-neutral-100">
                  <div
                    className="h-2 rounded-full bg-neutral-950"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <div className="mt-5 grid gap-3">
                  {defaultTasks.map((task) => (
                    <label
                      key={task}
                      className="flex items-center gap-3 rounded-lg border border-black/10 p-3 text-sm"
                    >
                      <input
                        checked={doneTasks.includes(task)}
                        onChange={() => toggleTask(task)}
                        type="checkbox"
                      />
                      <span>{task}</span>
                    </label>
                  ))}
                </div>
              </section>
              <section className="rounded-lg border border-black/10 bg-neutral-950 p-5 text-white">
                <p className="text-sm text-white/60">Focus sessions</p>
                <p className="mt-3 text-5xl font-semibold">{sessions}</p>
                <p className="mt-4 text-sm leading-6 text-white/70">
                  Keep one clean streak before chasing huge hours. Consistency wins boringly.
                </p>
              </section>
            </div>
          ) : null}

          {activeTab === "Doubts" ? (
            <section className="rounded-lg border border-black/10 bg-white p-5">
              <textarea
                value={doubt}
                onChange={(event) => setDoubt(event.target.value)}
                className="min-h-40 w-full rounded-lg border border-black/10 p-4 outline-none focus:border-neutral-950"
                placeholder="Paste your JEE doubt here..."
              />
              <button
                type="button"
                onClick={simplifyDoubt}
                className="mt-4 h-11 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white"
              >
                Simplify
              </button>
              <div className="mt-5 grid gap-3">
                {doubtAnswer.map((line) => (
                  <p key={line} className="rounded-lg bg-neutral-100 p-3 text-sm text-neutral-700">
                    {line}
                  </p>
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === "Formulas" ? (
            <section className="grid gap-4 md:grid-cols-2">
              {formulaSheets.map((sheet) => (
                <article key={`${sheet.subject}-${sheet.chapter}`} className="rounded-lg border border-black/10 bg-white p-5">
                  <p className="text-sm font-medium text-neutral-500">{sheet.subject}</p>
                  <h2 className="mt-1 text-lg font-semibold text-neutral-950">{sheet.chapter}</h2>
                  <div className="mt-4 grid gap-2">
                    {sheet.formulas.map((formula) => (
                      <p key={formula} className="rounded-lg bg-neutral-100 px-3 py-2 text-sm">
                        {formula}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </section>
          ) : null}

          {activeTab === "Planner" ? (
            <section className="rounded-lg border border-black/10 bg-white p-5">
              <label className="text-sm font-medium text-neutral-700">
                Daily hours
                <input
                  value={dailyHours}
                  onChange={(event) => setDailyHours(Number(event.target.value))}
                  type="number"
                  min={1}
                  max={12}
                  className="mt-2 h-11 w-full rounded-lg border border-black/10 px-3 outline-none focus:border-neutral-950"
                />
              </label>
              <button
                type="button"
                onClick={generatePlan}
                className="mt-4 h-11 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white"
              >
                Generate Plan
              </button>
              <div className="mt-5 grid gap-3">
                {plan.map((item) => (
                  <div key={`${item.label}-${item.subject}`} className="rounded-lg border border-black/10 p-4">
                    <p className="text-sm font-semibold text-neutral-950">
                      {item.subject} · {item.duration} min
                    </p>
                    <p className="mt-2 text-sm text-neutral-600">{item.task}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === "PYQ" ? (
            <section className="rounded-lg border border-black/10 bg-white p-5">
              <div className="grid gap-3">
                {highPriorityTopics.map((topic) => (
                  <div key={topic.topic} className="grid gap-2 rounded-lg border border-black/10 p-4 md:grid-cols-[1fr_8rem_8rem]">
                    <div>
                      <p className="font-semibold text-neutral-950">{topic.topic}</p>
                      <p className="text-sm text-neutral-500">{topic.subject}</p>
                    </div>
                    <p className="text-sm text-neutral-600">Weight {topic.weight}/10</p>
                    <p className="text-sm text-neutral-600">{topic.difficulty}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === "Pomodoro" ? (
            <section className="rounded-lg border border-black/10 bg-white p-5">
              <input
                value={focusMinutes}
                onChange={(event) => setFocusMinutes(Number(event.target.value))}
                type="range"
                min={15}
                max={90}
                step={5}
                className="w-full"
              />
              <p className="mt-3 text-5xl font-semibold text-neutral-950">{focusMinutes}:00</p>
              <button
                type="button"
                onClick={logSession}
                className="mt-5 h-11 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white"
              >
                Log Session
              </button>
            </section>
          ) : null}

          {activeTab === "Rank" ? (
            <section className="rounded-lg border border-black/10 bg-white p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-neutral-700">
                  Marks
                  <input
                    value={marks}
                    onChange={(event) => setMarks(Number(event.target.value))}
                    type="number"
                    className="mt-2 h-11 w-full rounded-lg border border-black/10 px-3"
                  />
                </label>
                <label className="text-sm font-medium text-neutral-700">
                  Accuracy
                  <input
                    value={accuracy}
                    onChange={(event) => setAccuracy(Number(event.target.value))}
                    type="number"
                    className="mt-2 h-11 w-full rounded-lg border border-black/10 px-3"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={predictRank}
                className="mt-4 h-11 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white"
              >
                Predict
              </button>
              {rankResult ? (
                <div className="mt-5 rounded-lg bg-neutral-100 p-4">
                  <p className="font-semibold text-neutral-950">{rankResult.band}</p>
                  <p className="mt-2 text-sm text-neutral-600">{rankResult.nextMove}</p>
                </div>
              ) : null}
            </section>
          ) : null}

          {activeTab === "Organic" ? (
            <section className="grid gap-4 md:grid-cols-2">
              {organicOrders.map((item) => (
                <article key={item.title} className="rounded-lg border border-black/10 bg-white p-5">
                  <h2 className="font-semibold text-neutral-950">{item.title}</h2>
                  <p className="mt-3 rounded-lg bg-neutral-100 p-3 text-sm">{item.order}</p>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{item.why}</p>
                </article>
              ))}
            </section>
          ) : null}
        </section>
      </div>
    </main>
  );
}
