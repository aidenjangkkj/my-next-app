import { useRef, useState, type FormEvent, type ChangeEvent } from "react";
import Seo from "@/components/Seo";
import { CONTACT_LIMITS, validateContactInput } from "@/lib/contact";

const emptyForm = { name: "", email: "", message: "", website: "" };
export default function Contact() {
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const pending = useRef(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setFormData({ ...formData, [event.target.name]: event.target.value });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const validation = validateContactInput(formData);
    if (!validation.ok) {
      setStatus({ type: "error", message: validation.error });
      return;
    }
    pending.current = true;
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.value),
      });
      const result = await response.json();
      if (!response.ok || !result.ok)
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "메시지 전송에 실패했습니다.",
        );
      setStatus({
        type: "success",
        message: "메시지를 전송했습니다. 확인 후 회신하겠습니다.",
      });
      setFormData(emptyForm);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "전송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      });
    } finally {
      pending.current = false;
      setLoading(false);
    }
  }

  return (
    <main className="page-shell py-14 sm:py-20">
      <Seo
        title="연락 | 장석환 Frontend Developer"
        description="채용·협업 문의나 경력과 글에 관한 질문을 남겨 주세요."
        path="/contact"
      />
      <div className="grid gap-10 lg:grid-cols-2">
        <header>
          <p className="eyebrow">연락</p>
          <h1 className="page-heading mt-4">연락하기</h1>
          <p className="mt-6 max-w-md leading-8 text-slate-600">
            채용·협업 문의나 경력과 글에 관한 질문을 남겨 주세요. 입력한 내용은
            이메일로 전달됩니다.
          </p>
          <a
            href="https://github.com/aidenjangkkj"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link mt-7 inline-block text-sm font-semibold"
          >
            GitHub에서 공개 코드 보기 <span aria-hidden="true">↗</span>
            <span className="sr-only"> 새 탭</span>
          </a>
        </header>
        <form
          onSubmit={handleSubmit}
          aria-busy={loading}
          className="rounded-lg border border-slate-200 p-6 sm:p-8"
        >
          <div hidden>
            <label htmlFor="contact-website">웹사이트: 비워 두세요</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              autoComplete="off"
              value={formData.website}
              onChange={handleChange}
              tabIndex={-1}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="contact-name"
              className="mb-2 block text-sm font-semibold"
            >
              이름
            </label>
            <input
              id="contact-name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={CONTACT_LIMITS.name}
              required
              className="w-full rounded-md border border-slate-300 px-4 py-3"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="contact-email"
              className="mb-2 block text-sm font-semibold"
            >
              이메일
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              maxLength={CONTACT_LIMITS.email}
              required
              className="w-full rounded-md border border-slate-300 px-4 py-3"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="contact-message"
              className="mb-2 block text-sm font-semibold"
            >
              메시지
            </label>
            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              maxLength={CONTACT_LIMITS.message}
              rows={7}
              required
              aria-describedby="message-limit"
              className="w-full rounded-md border border-slate-300 px-4 py-3"
            />
            <p id="message-limit" className="mt-2 text-xs text-slate-500">
              최대 {CONTACT_LIMITS.message.toLocaleString("ko-KR")}자
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="button-primary w-full disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "전송 중…" : "메시지 보내기"}
          </button>
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={`mt-4 text-sm leading-7 ${status?.type === "error" ? "text-red-700" : "text-emerald-800"}`}
          >
            {status?.message ?? ""}
          </p>
        </form>
      </div>
    </main>
  );
}
