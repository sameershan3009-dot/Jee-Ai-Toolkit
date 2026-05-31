export const formulaSheets = [
  {
    subject: "Physics",
    chapter: "Electrostatics",
    formulas: [
      "F = k q1 q2 / r^2",
      "E = F / q",
      "V = kq / r",
      "U = k q1 q2 / r",
      "C = q / V"
    ]
  },
  {
    subject: "Physics",
    chapter: "Current Electricity",
    formulas: ["V = IR", "P = VI", "R = rho L / A", "I = neAvd", "Req(series) = R1 + R2"]
  },
  {
    subject: "Chemistry",
    chapter: "Chemical Equilibrium",
    formulas: ["Kp = Kc(RT)^delta n", "pH = -log[H+]", "Ka.Kb = Kw", "alpha = sqrt(Kc / C)"]
  },
  {
    subject: "Chemistry",
    chapter: "Organic Chemistry",
    formulas: [
      "Inductive effect: -I/+I",
      "Resonance stabilizes charge",
      "SN1 favors stable carbocation",
      "SN2 favors low steric hindrance"
    ]
  },
  {
    subject: "Maths",
    chapter: "Limits",
    formulas: [
      "lim sin x / x = 1",
      "lim (1 + 1/n)^n = e",
      "d/dx x^n = nx^(n-1)",
      "L'Hospital applies to 0/0 or infinity/infinity"
    ]
  },
  {
    subject: "Maths",
    chapter: "Matrices",
    formulas: ["A adj(A) = |A|I", "(AB)^-1 = B^-1 A^-1", "A^T transpose rules", "det(AB) = det(A)det(B)"]
  }
];

export const pyqTopics = [
  { topic: "Electrostatics", subject: "Physics", weight: 9, difficulty: "Moderate", trend: "Rising" },
  { topic: "Modern Physics", subject: "Physics", weight: 8, difficulty: "Easy-Moderate", trend: "Stable" },
  { topic: "GOC", subject: "Chemistry", weight: 10, difficulty: "High", trend: "Rising" },
  { topic: "Coordination", subject: "Chemistry", weight: 8, difficulty: "Moderate", trend: "Stable" },
  { topic: "Limits", subject: "Maths", weight: 7, difficulty: "Moderate", trend: "Stable" },
  { topic: "Matrices", subject: "Maths", weight: 6, difficulty: "Easy-Moderate", trend: "Stable" }
];

export const organicOrders = [
  {
    title: "Carbocation Stability",
    order: "Benzylic/Allylic > 3 degree > 2 degree > 1 degree > methyl",
    why: "Hyperconjugation, resonance, and electron donation disperse positive charge."
  },
  {
    title: "Acidity",
    order: "Carboxylic acids > phenols > alcohols > alkynes > alkenes > alkanes",
    why: "The more stable the conjugate base, the stronger the acid."
  },
  {
    title: "SN2 Reactivity",
    order: "Methyl > 1 degree > 2 degree >> 3 degree",
    why: "Backside attack needs low steric hindrance."
  },
  {
    title: "Leaving Group Ability",
    order: "I- > Br- > Cl- > F-",
    why: "Weaker bases leave more easily."
  }
];

export const defaultTasks = [
  "Revise one weak formula sheet",
  "Solve 20 mixed PYQs",
  "Log 3 mistakes with exact reason",
  "Run one 45 minute focus session"
];
