import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// 간단한 메모리 레이트리미트 (프로덕션은 업그레이드 권장)
const ipHits = new Map<string, { count: number; ts: number }>();
function rateLimit(ip: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const data = ipHits.get(ip) || { count: 0, ts: now };
  if (now - data.ts > windowMs) {
    ipHits.set(ip, { count: 1, ts: now });
    return false;
  }
  data.count += 1;
  ipHits.set(ip, data);
  return data.count > limit;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  if (rateLimit(ip)) return res.status(429).json({ ok: false, error: 'Too Many Requests' });

  const { name = '', email = '', message = '', website = '' } = req.body || {};

  // 허니팟(봇 차단): 사용자가 보지 못하는 hidden 입력값, 값이 채워져 있으면 거절
  if (website) return res.status(400).json({ ok: false, error: 'Bad Request' });

  if (!name.trim() || !email.trim() || !message.trim()) {
    return res.status(400).json({ ok: false, error: '모든 항목을 입력해 주세요.' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ ok: false, error: '이메일 형식이 올바르지 않습니다.' });
  }

  const to = process.env.CONTACT_TO!;
  const from = process.env.CONTACT_FROM || process.env.SMTP_USER!;

  const html = `
    <h2>포트폴리오 문의</h2>
    <p><strong>이름:</strong> ${name}</p>
    <p><strong>이메일:</strong> ${email}</p>
    <p><strong>메시지:</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit">${message}</pre>
  `;

  try {
    await transporter.sendMail({
      to,
      from,
      subject: `📩 새 문의 - ${name}`,
      replyTo: `${name} <${email}>`,
      html,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('sendMail error:', err);
    return res.status(500).json({ ok: false, error: '메일 전송에 실패했습니다.' });
  }
}
