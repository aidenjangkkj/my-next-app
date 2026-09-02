export const CONTACT_LIMITS = { name: 100, email: 254, message: 5000 } as const;
export interface ContactInput { name: string; email: string; message: string; website: string }
type ContactValidation = { ok: true; value: ContactInput } | { ok: false; error: string };

export function validateContactInput(input: unknown): ContactValidation {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, error: "올바른 입력이 필요합니다." };
  const body = input as Record<string, unknown>;
  for (const field of ["name", "email", "message"] as const) {
    const value = body[field];
    if (typeof value !== "string" || !value.trim()) return { ok: false, error: "이름, 이메일과 메시지를 입력해 주세요." };
    if (value.length > CONTACT_LIMITS[field]) return { ok: false, error: "입력 가능한 최대 길이를 초과했습니다." };
  }
  if (body.website !== undefined && body.website !== "") return { ok: false, error: "올바른 입력이 필요합니다." };
  const value = { name: (body.name as string).trim(), email: (body.email as string).trim(), message: (body.message as string).trim(), website: "" };
  if (/[\r\n]/.test(value.name) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) return { ok: false, error: "이름 또는 이메일 형식이 올바르지 않습니다." };
  return { ok: true, value };
}

export function escapeHtml(value: string) {
  const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return value.replace(/[&<>"']/g, (character) => entities[character]);
}
