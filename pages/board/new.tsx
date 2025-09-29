import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Navigation from "@/components/Navigation";
import { db } from "@/lib/firebase";
import "../../app/globals.css";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await addDoc(collection(db, "posts"), {
        title: title.trim(),
        content: content.trim(),
        createdAt: serverTimestamp(),
      });

      setSuccessMessage("게시글이 성공적으로 저장되었습니다.");
      setTitle("");
      setContent("");

      setTimeout(() => {
        void router.push("/board");
      }, 800);
    } catch (err) {
      console.error("게시글 저장 중 오류 발생:", err);
      setError("게시글을 저장하는 동안 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Head>
        <title>새 글 작성 - My Portfolio</title>
        <meta name="description" content="게시판에 새로운 글을 작성하고 공유해 보세요." />
      </Head>
      <Navigation />
      <main className="bg-gray-100 min-h-screen pt-24 pb-16 px-6 text-gray-900">
        <div className="mx-auto w-full max-w-3xl rounded-lg bg-white p-8 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">새 글 작성</h1>
            <Link
              href="/board"
              className="text-sm font-semibold text-indigo-600 hover:underline"
            >
              게시판으로 돌아가기
            </Link>
          </div>
          <p className="mb-6 text-sm text-gray-600">
            다른 방문자와 나누고 싶은 소식이나 인사이트가 있다면 자유롭게 공유해 주세요.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="mb-2 block font-semibold">
                제목
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="게시글의 제목을 입력하세요"
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                minLength={3}
                maxLength={120}
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="mb-2 block font-semibold">
                내용
              </label>
              <textarea
                id="content"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                className="min-h-[200px] w-full rounded-lg border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                minLength={10}
                maxLength={4000}
                required
              />
            </div>
            {error && (
              <p className="rounded bg-red-50 p-3 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}
            {successMessage && (
              <p className="rounded bg-green-50 p-3 text-sm text-green-700" role="status">
                {successMessage}
              </p>
            )}
            <div className="flex items-center justify-end gap-4">
              <Link
                href="/board"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                취소
              </Link>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? "저장 중..." : "게시글 저장"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
