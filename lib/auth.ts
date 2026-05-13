export const SESSION_COOKIE = "apex_session";

/** Demo credentials — lab only. Values are user ids stored in the session cookie. */
const CREDENTIALS: Record<string, { password: string; userId: string }> = {
  "john@apex.lab": { password: "password101", userId: "101" },
  "jane@apex.lab": { password: "password102", userId: "102" },
  "robert@apex.lab": { password: "password103", userId: "103" },
  "maria@apex.lab": { password: "password104", userId: "104" },
  "james@apex.lab": { password: "password105", userId: "105" },
};

export function verifyLogin(email: string, password: string): string | null {
  const normalized = email.trim().toLowerCase();
  const row = CREDENTIALS[normalized];
  if (!row || row.password !== password) return null;
  return row.userId;
}
