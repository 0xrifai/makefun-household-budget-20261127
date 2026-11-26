// DompetKita — the household's books: seed data plus the family's own edits.
// Edits (new, changed or deleted transactions, goal top-ups, budget changes)
// live in localStorage under one key, so a reload keeps them and a fresh
// browser still shows the 36 seed transactions exactly as data.js holds them.

import { CATEGORIES, GOALS, TRANSACTIONS, DEFAULT_MONTH, MONTHS } from "./data.js";

const STORAGE_KEY = "dompetkita-v2";

function readSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { extra: [], removed: [], edited: {}, goals: {}, budgets: {} };
    const parsed = JSON.parse(raw);
    return {
      extra: Array.isArray(parsed.extra) ? parsed.extra : [],
      removed: Array.isArray(parsed.removed) ? parsed.removed : [],
      edited: parsed.edited && typeof parsed.edited === "object" ? parsed.edited : {},
      goals: parsed.goals && typeof parsed.goals === "object" ? parsed.goals : {},
      budgets: parsed.budgets && typeof parsed.budgets === "object" ? parsed.budgets : {},
    };
  } catch (e) {
    return { extra: [], removed: [], edited: {}, goals: {}, budgets: {} };
  }
}

function writeSaved(saved) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch (e) {
    // Private mode or a full store: the site still works for this visit.
  }
}

let saved = readSaved();
let month = DEFAULT_MONTH;

export function currentMonth() {
  return month;
}

export function setMonth(id) {
  if (MONTHS.some((m) => m.id === id)) month = id;
}

export function monthIds() {
  return MONTHS.map((m) => m.id);
}

// All transactions: seeds (minus deleted, plus edits) and the family's own.
export function allTransactions() {
  const removed = new Set(saved.removed);
  const list = TRANSACTIONS.filter((t) => !removed.has(t.id)).map((t) => {
    return saved.edited[t.id] ? { ...t, ...saved.edited[t.id] } : t;
  });
  return list.concat(saved.extra);
}

export function monthTransactions(monthId) {
  return allTransactions()
    .filter((t) => t.date.slice(0, 7) === monthId)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

// Income, spending and what is left for one month.
export function monthSummary(monthId) {
  const rows = monthTransactions(monthId);
  let income = 0;
  let expense = 0;
  for (const t of rows) {
    if (t.kind === "in") income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, left: income - expense, count: rows.length };
}

// Spending per category for one month, in CATEGORIES order.
export function monthByCategory(monthId) {
  const rows = monthTransactions(monthId);
  return CATEGORIES.map((c) => {
    const spent = rows
      .filter((t) => t.kind === "out" && t.cat === c.id)
      .reduce((s, t) => s + t.amount, 0);
    return { ...c, spent, budget: budgetFor(c.id) };
  });
}

// Spending per category across every month (for the Reports page).
export function allByCategory() {
  const rows = allTransactions();
  return CATEGORIES.map((c) => {
    const spent = rows
      .filter((t) => t.kind === "out" && t.cat === c.id)
      .reduce((s, t) => s + t.amount, 0);
    return { ...c, spent };
  }).sort((a, b) => b.spent - a.spent);
}

export function budgetFor(categoryId) {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  const base = cat ? cat.budget : 0;
  return typeof saved.budgets[categoryId] === "number" ? saved.budgets[categoryId] : base;
}

export function setBudget(categoryId, amount) {
  saved.budgets[categoryId] = Math.max(0, Math.round(amount));
  writeSaved(saved);
}

export function goals() {
  return GOALS.map((g) => {
    const extra = typeof saved.goals[g.id] === "number" ? saved.goals[g.id] : 0;
    return { ...g, saved: g.saved + extra, topup: extra };
  });
}

export function addToGoal(goalId, amount) {
  const n = Math.round(amount);
  if (!(n > 0)) return false;
  saved.goals[goalId] = (saved.goals[goalId] || 0) + n;
  writeSaved(saved);
  return true;
}

export function addTransaction(tx) {
  // A user-made id only needs to be unique inside this browser's store.
  const id = "u" + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
  const row = { id, ...tx };
  saved.extra.push(row);
  writeSaved(saved);
  return row;
}

export function updateTransaction(id, patch) {
  const seed = TRANSACTIONS.find((t) => t.id === id);
  if (seed) {
    saved.edited[id] = { ...(saved.edited[id] || {}), ...patch };
  } else {
    const row = saved.extra.find((t) => t.id === id);
    if (row) Object.assign(row, patch);
  }
  writeSaved(saved);
}

export function deleteTransaction(id) {
  const seed = TRANSACTIONS.find((t) => t.id === id);
  if (seed) {
    if (!saved.removed.includes(id)) saved.removed.push(id);
    delete saved.edited[id];
  } else {
    saved.extra = saved.extra.filter((t) => t.id !== id);
  }
  writeSaved(saved);
}

export function resetAll() {
  saved = { extra: [], removed: [], edited: {}, goals: {}, budgets: {} };
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Ignore: a fresh state is already in memory.
  }
}
