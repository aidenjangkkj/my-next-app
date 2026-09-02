import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { escapeHtml, validateContactInput } from "@/lib/contact";

export const config = { api: { bodyParser: { sizeLimit: "20kb" } } };
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// ponytail: 이 Map은 서버리스 인스턴스 간 공유되지 않습니다. 분산 한도가 필요하면 공유 저장소로 교체합니다.
const ipHits = new Map<string, { count: number; ts: number }>();
function rateLimit(ip: string) {
  const now = Date.now();
  for (const [key, value] of ipHits) if (now - value.ts >= 60_000) ipHits.delete(key);
  // 인스턴스별 메모리 상한. 전체 서비스의 분산 요청 제한은 아닙니다.
  if (!ipHits.has(ip) && ipHits.size >= 1000) return true;
  const data = ipHits.get(ip) ?? { count: 0, ts: now };
  data.count += 1;
  ipHits.set(ip, data);
  return data.count > 5;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false, error: "Method Not Allowed" }); }
  const forwarded = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
  if (rateLimit(ip)) { res.setHeader("Retry-After", "60"); return res.status(429).json({ ok: false, error: "잠시 후 다시 시도해 주세요." }); }
  const validation = validateContactInput(req.body);
  if (!validation.ok) return res.status(400).json({ ok: false, error: validation.error });
  const { name, email, message } = validation.value;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM || process.env.SMTP_USER;
  if (!to || !from || !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return res.status(503).json({ ok: false, error: "현재 메일 전송을 사용할 수 없습니다. 잠시 후 다시 시도해 주세요." });
  const html = `<h2>포트폴리오 문의</h2><p><strong>이름:</strong> ${escapeHtml(name)}</p><p><strong>이메일:</strong> ${escapeHtml(email)}</p><p><strong>메시지:</strong></p><pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message)}</pre>`;
  try {
    await transporter.sendMail({ to, from, subject: `포트폴리오 문의 - ${name}`, replyTo: { name, address: email }, text: `이름: ${name}\n이메일: ${email}\n\n${message}`, html });
    return res.status(200).json({ ok: true });
  } catch {
    console.error("포트폴리오 문의 메일 전송 실패");
    return res.status(500).json({ ok: false, error: "메일 전송에 실패했습니다." });
  }
}
