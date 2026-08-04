import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import AdminGuard from "@/components/AdminGuard";
import Navigation from "@/components/Navigation";
import PostForm from "@/components/PostForm";
import { fromDateTimeLocal, toDateTimeLocal } from "@/lib/blog";
import { getFirebaseDb } from "@/lib/firebase";
import "../../../app/globals.css";

export default function NewAdminPost() {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>새 글 작성 · 블로그 관리</title>
      </Head>
      <Navigation />
      <main className="min-h-screen bg-gray-100 px-6 pb-16 pt-28 text-gray-900">
        <div className="mx-auto max-w-4xl">
          <AdminGuard>
            <div className="rounded-xl bg-white p-6 shadow-md md:p-10">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-indigo-600">Blog Admin</p>
                  <h1 className="mt-1 text-3xl font-bold">새 글 작성</h1>
                </div>
                <Link
                  href="/admin/posts"
                  className="font-semibold text-gray-600 hover:text-gray-900"
                >
                  목록으로 돌아가기
                </Link>
              </div>

              <PostForm
                initialValues={{
                  title: "",
                  content: "",
                  createdAt: toDateTimeLocal(new Date()),
                }}
                submitLabel="글 공개하기"
                onSubmit={async (values) => {
                  const createdAt = fromDateTimeLocal(values.createdAt);
                  if (!createdAt) {
                    throw new Error("올바른 작성일을 입력해 주세요.");
                  }

                  await addDoc(collection(getFirebaseDb(), "posts"), {
                    title: values.title,
                    content: values.content,
                    createdAt: Timestamp.fromDate(createdAt),
                  });
                  await router.push("/admin/posts");
                }}
              />
            </div>
          </AdminGuard>
        </div>
      </main>
    </div>
  );
}
