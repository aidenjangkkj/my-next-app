import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import AdminGuard from "@/components/AdminGuard";
import Navigation from "@/components/Navigation";
import PostForm from "@/components/PostForm";
import {
  fromDateTimeLocal,
  mapBlogPost,
  type PostFormValues,
  toDateTimeLocal,
} from "@/lib/blog";
import { getFirebaseDb } from "@/lib/firebase";
import "../../../../app/globals.css";

async function fetchPost(postId: string): Promise<PostFormValues | null> {
  const postSnapshot = await getDoc(doc(getFirebaseDb(), "posts", postId));
  if (!postSnapshot.exists()) return null;

  const post = mapBlogPost(postSnapshot.id, postSnapshot.data());
  return {
    title: post.title,
    content: post.content,
    createdAt: post.createdAt
      ? toDateTimeLocal(new Date(post.createdAt))
      : toDateTimeLocal(new Date()),
  };
}

function EditPostContent({ postId }: { postId: string }) {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<PostFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    void fetchPost(postId)
      .then((values) => {
        if (isActive) setInitialValues(values);
      })
      .catch((loadError) => {
        console.error("수정할 게시글을 불러오는 중 오류 발생:", loadError);
        if (isActive) setError("게시글을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [postId]);

  if (isLoading) {
    return <p className="rounded-lg bg-white p-6 shadow-sm">게시글을 불러오고 있습니다.</p>;
  }

  if (error) {
    return (
      <p className="rounded-lg bg-red-50 p-6 text-red-700" role="alert">
        {error}
      </p>
    );
  }

  if (!initialValues) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p>수정할 게시글을 찾을 수 없습니다.</p>
        <Link
          href="/admin/posts"
          className="mt-4 inline-flex font-semibold text-indigo-600 hover:underline"
        >
          관리자 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-md md:p-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-indigo-600">Blog Admin</p>
          <h1 className="mt-1 text-3xl font-bold">글 수정</h1>
        </div>
        <Link
          href="/admin/posts"
          className="font-semibold text-gray-600 hover:text-gray-900"
        >
          목록으로 돌아가기
        </Link>
      </div>

      <PostForm
        initialValues={initialValues}
        submitLabel="수정 내용 저장"
        onSubmit={async (values) => {
          const createdAt = fromDateTimeLocal(values.createdAt);
          if (!createdAt) {
            throw new Error("올바른 작성일을 입력해 주세요.");
          }

          await updateDoc(doc(getFirebaseDb(), "posts", postId), {
            title: values.title,
            content: values.content,
            createdAt: Timestamp.fromDate(createdAt),
            updatedAt: serverTimestamp(),
          });
          await router.push("/admin/posts");
        }}
      />
    </div>
  );
}

export default function EditAdminPost() {
  const router = useRouter();
  const postId =
    router.isReady && typeof router.query.id === "string"
      ? router.query.id
      : null;

  return (
    <div>
      <Head>
        <title>글 수정 · 블로그 관리</title>
      </Head>
      <Navigation />
      <main className="min-h-screen bg-gray-100 px-6 pb-16 pt-28 text-gray-900">
        <div className="mx-auto max-w-4xl">
          <AdminGuard>
            {postId ? (
              <EditPostContent postId={postId} />
            ) : (
              <p className="rounded-lg bg-white p-6 shadow-sm">
                게시글 정보를 확인하고 있습니다.
              </p>
            )}
          </AdminGuard>
        </div>
      </main>
    </div>
  );
}
