import fs from "fs";
import path from "path";
import type { LabUser, StatementRecord, WealthLabData } from "./types";

let cache: WealthLabData | null = null;

export function loadWealthLab(): WealthLabData {
  if (cache) return cache;
  const filePath = path.join(process.cwd(), "data", "wealth-lab.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  cache = JSON.parse(raw) as WealthLabData;
  return cache;
}

/** Lab IDOR: keyed only by URL / caller-supplied id — never cross-checked to session. */
export function getUserById(userId: string): LabUser | undefined {
  return loadWealthLab().users.find((u) => u.id === userId);
}

export function getStatementsForUser(userId: string): StatementRecord[] {
  return loadWealthLab().statements.filter((s) => s.userId === userId);
}

/** Lab IDOR: used by download API with raw `id` from query string. */
export function getStatementById(id: string): StatementRecord | undefined {
  return loadWealthLab().statements.find((s) => s.id === id);
}

export function listUserIds(): string[] {
  return loadWealthLab().users.map((u) => u.id);
}
