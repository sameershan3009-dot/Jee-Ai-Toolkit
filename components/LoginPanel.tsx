"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  name: string;
  email: string;
  grade: string;
  targetYear: string;
};

export default function LoginPanel() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    grade: "Class 12",
    targetYear: "JEE 2027"
  });
  const [error, setError] = useState("");

  function updateProfile(key: keyof Profile, value: string) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function continueToDashboard() {
    if (!profile.name.trim() || !profile.email.trim()) {
      setError("Enter your name and email to continue.");
      return;
    }

    window.localStorage.setItem("jee-ai-profile", JSON.stringify(profile));
    router.push("/dashboard");
  }

  return (
    <section className="mx-auto grid min-h-screen max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <a href="/" className="text-sm font-semibold text-neutral-950">
          JEE AI Toolkit
        </a>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-neutral-950 md:text-6xl">
          Set up your study desk.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600">
          Start as a guest with saved browser progress. Supabase login can replace this local
          profile when the database is connected.
        </p>
      </div>

      <div className="rounded-lg border border-black/10 bg-white p-5 shadow-soft md:p-7">
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-neutral-700">
            Name
            <input
              value={profile.name}
              onChange={(event) => updateProfile("name", event.target.value)}
              className="h-12 rounded-lg border border-black/10 px-4 outline-none focus:border-neutral-950"
              placeholder="Sameer"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-neutral-700">
            Email
            <input
              value={profile.email}
              onChange={(event) => updateProfile("email", event.target.value)}
              className="h-12 rounded-lg border border-black/10 px-4 outline-none focus:border-neutral-950"
              placeholder="you@example.com"
              type="email"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-neutral-700">
              Class
              <select
                value={profile.grade}
                onChange={(event) => updateProfile("grade", event.target.value)}
                className="h-12 rounded-lg border border-black/10 px-4 outline-none focus:border-neutral-950"
              >
                <option>Class 11</option>
                <option>Class 12</option>
                <option>Dropper</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-neutral-700">
              Target
              <select
                value={profile.targetYear}
                onChange={(event) => updateProfile("targetYear", event.target.value)}
                className="h-12 rounded-lg border border-black/10 px-4 outline-none focus:border-neutral-950"
              >
                <option>JEE 2026</option>
                <option>JEE 2027</option>
                <option>JEE 2028</option>
              </select>
            </label>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="button"
            onClick={continueToDashboard}
            className="h-12 rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}
