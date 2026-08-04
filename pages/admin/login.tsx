import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  type AuthError,
} from "firebase/auth";
import Navigation from "@/components/Navigation";
import { getFirebaseAuth } from "@/lib/firebase";
import "../../app/globals.css";

export default function AdminLogin() {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setIsSigningIn(true);
      setError(null);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(getFirebaseAuth(), provider);
      await router.push("/admin/posts");
    } catch (loginError) {
      if ((loginError as AuthError).code !== "auth/popup-closed-by-user") {
        console.error("Google 관리자 로그인 중 오류 발생:", loginError);
        setError("Google 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div>
      <Head>
        <title>관리자 로그인 · 기술 블로그</title>
        <meta name="description" content="기술 블로그 관리자 로그인" />
      </Head>
      <Navigation />
      <main className="min-h-screen bg-gray-100 px-6 pb-16 pt-28 text-gray-900">
        <section className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-md">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Blog Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold">관리자 로그인</h1>
          <p className="mt-3 text-gray-600">
            등록된 Google 계정으로 로그인해 글을 관리하세요.
          </p>

          <button
            type="button"
            onClick={() => void handleGoogleLogin()}
            disabled={isSigningIn}
            className="mt-8 w-full rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigningIn ? "로그인 중..." : "Google로 로그인"}
          </button>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <Link
            href="/blog"
            className="mt-6 inline-flex text-sm font-semibold text-indigo-600 hover:underline"
          >
            블로그로 돌아가기
          </Link>
        </section>
      </main>
    </div>
  );
}
