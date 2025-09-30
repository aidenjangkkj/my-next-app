import Head from "next/head";
import { FC, useState } from "react";
import "../app/globals.css";
import Navigation from "@/components/Navigation";

const Contact: FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
  }); // website = honeypot
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "전송 실패");
      setToast({
        type: "success",
        msg: "메시지가 전송되었습니다. 빠르게 확인하겠습니다!",
      });
      setFormData({ name: "", email: "", message: "", website: "" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setToast({ type: "error", msg: err.message });
      } else {
        setToast({ type: "error", msg: "전송 중 오류가 발생했습니다." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>연락하기 · 포트폴리오</title>
        <meta
          name="description"
          content="협업이나 문의를 위해 저에게 연락해 보세요."
        />
      </Head>
      <Navigation />
      <section className="py-16 bg-gray-100 text-gray-900 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-4xl w-full px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">연락하기</h2>
          <p className="text-sm text-gray-600 mb-8">
            아래 폼을 작성해 주시면 메일로 전달됩니다.
          </p>

          <form
            className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mx-auto text-left"
            onSubmit={handleSubmit}
          >
            {/* 허니팟 필드 (봇 차단용) */}
            <input
              type="text"
              name="website"
              autoComplete="off"
              value={formData.website}
              onChange={handleChange}
              className="hidden"
              tabIndex={-1}
            />

            <div className="mb-4">
              <label className="block font-semibold mb-1">이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">이메일</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-1">메시지</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={5}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "전송 중…" : "메시지 보내기"}
            </button>

            {toast && (
              <p
                className={`mt-4 text-sm ${
                  toast.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {toast.msg}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
