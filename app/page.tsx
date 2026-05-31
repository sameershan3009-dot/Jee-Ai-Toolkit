import RazorpayCheckout from "@/components/RazorpayCheckout";
import ToolkitLab from "@/components/ToolkitLab";

const tools = [
  {
    name: "AI Doubt Simplifier",
    detail: "Turn dense JEE questions into step-by-step explanations with controlled credits."
  },
  {
    name: "Formula Hub",
    detail: "Fast Physics, Chemistry, and Maths revision cards for Class 11 and 12."
  },
  {
    name: "Smart Planner",
    detail: "Generate weekly study blocks from exam target, backlog, and daily hours."
  },
  {
    name: "PYQ Analyzer",
    detail: "Summarize topic frequency, difficulty, and weak areas from uploaded practice data."
  },
  {
    name: "Session Tools",
    detail: "Pomodoro, streaks, session notes, and consistency signals for daily prep."
  },
  {
    name: "Rank Predictor",
    detail: "Estimate likely score and rank bands from mock-test marks and accuracy."
  }
];

const plannerBlocks = [
  ["Physics", "Electrostatics revision", "75 min"],
  ["Chemistry", "GOC reaction order drills", "60 min"],
  ["Maths", "Limits PYQ mixed set", "90 min"],
  ["Review", "Error log and formula recall", "30 min"]
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-black/5 bg-white/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#" className="text-sm font-semibold tracking-tight text-neutral-950">
            JEE AI Toolkit
          </a>
          <div className="hidden items-center gap-6 text-sm text-neutral-600 md:flex">
            <a href="#tools" className="hover:text-neutral-950">
              Tools
            </a>
            <a href="#planner" className="hover:text-neutral-950">
              Planner
            </a>
            <a href="#credits" className="hover:text-neutral-950">
              Credits
            </a>
            <a href="/dashboard" className="hover:text-neutral-950">
              Dashboard
            </a>
            <a href="/about" className="hover:text-neutral-950">
              About
            </a>
          </div>
          <a
            href="/login"
            className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Sign in
          </a>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.04fr_0.96fr] md:items-center md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Public MVP for JEE 2027/28
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight text-neutral-950 md:text-7xl">
            A calm AI desk for serious JEE prep.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
            Doubt simplification, revision, planning, PYQ analysis, and session discipline in one
            student-first dashboard. Free-first today, monetization-ready for tomorrow.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Open dashboard
            </a>
            <a
              href="#credits"
              className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-neutral-950 transition hover:border-black/30"
            >
              Test Razorpay
            </a>
          </div>
        </div>

        <section className="rounded-[2rem] border border-black/10 bg-white/80 p-4 shadow-soft backdrop-blur">
          <div className="rounded-[1.5rem] bg-neutral-950 p-5 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-white/60">Today</p>
                <h2 className="text-xl font-semibold">Study Dashboard</h2>
              </div>
              <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-950">
                82 credits
              </div>
            </div>
            <div className="grid gap-3 py-5 sm:grid-cols-3">
              {["4.5h focus", "12 streak", "68% accuracy"].map((metric) => (
                <div key={metric} className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-medium">{metric}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-white/15">
                    <div className="h-1.5 w-2/3 rounded-full bg-white" />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-white p-4 text-neutral-950">
              <p className="text-sm font-semibold">Next high-impact task</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Revise electrostatic potential formulas, then solve 12 mixed PYQs before checking
                the error log.
              </p>
            </div>
          </div>
        </section>
      </section>

      <section id="tools" className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-500">Toolkit</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
              Tools students actually open daily
            </h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <article
              key={tool.name}
              className="rounded-3xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur"
            >
              <h3 className="text-lg font-semibold text-neutral-950">{tool.name}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">{tool.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="planner" className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="text-sm font-medium text-neutral-500">Smart planner preview</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Hybrid AI where it saves cost
          </h2>
          <p className="mt-4 text-sm leading-7 text-neutral-600">
            Planner, formula, predictor, and PYQ outputs can start with deterministic logic. Real AI
            is reserved for explanations and doubt simplification, protected by credit limits.
          </p>
        </div>
        <div className="rounded-[2rem] border border-black/10 bg-neutral-950 p-4 text-white shadow-soft">
          <div className="space-y-3">
            {plannerBlocks.map(([subject, task, time]) => (
              <div
                key={`${subject}-${task}`}
                className="grid grid-cols-[6.5rem_1fr_4rem] items-center gap-3 rounded-2xl bg-white/10 p-4 text-sm"
              >
                <span className="font-semibold">{subject}</span>
                <span className="text-white/70">{task}</span>
                <span className="text-right text-white/60">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ToolkitLab />

      <section id="credits" className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="text-sm font-medium text-neutral-500">Payments</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Razorpay Standard Checkout is ready.
          </h2>
          <p className="mt-4 text-sm leading-7 text-neutral-600">
            Deployed on Vercel without buying a domain. Use the free
            <span className="font-medium text-neutral-950"> .vercel.app </span>
            URL for public testing and live Razorpay payments after account activation.
          </p>
        </div>
        <RazorpayCheckout />
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="rounded-[2rem] border border-dashed border-black/15 bg-white/60 p-6 text-center text-sm text-neutral-500">
          Ad slot reserved for later. Keep disabled until the site has enough original content and
          AdSense approval.
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-10 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
        <p>JEE AI Toolkit MVP</p>
        <div className="flex flex-wrap gap-4">
          <a href="/about" className="hover:text-neutral-950">
            About
          </a>
          <a href="/contact" className="hover:text-neutral-950">
            Contact
          </a>
          <a href="/dashboard" className="hover:text-neutral-950">
            Dashboard
          </a>
          <a href="/privacy" className="hover:text-neutral-950">
            Privacy
          </a>
          <a href="/terms" className="hover:text-neutral-950">
            Terms
          </a>
          <a href="/refund" className="hover:text-neutral-950">
            Refunds
          </a>
          <a href="/disclaimer" className="hover:text-neutral-950">
            Disclaimer
          </a>
        </div>
      </footer>
    </main>
  );
}
