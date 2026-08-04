import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import AdminGuard from "@/components/AdminGuard";
import Navigation from "@/components/Navigation";
import { mapBlogPost, sortBlogPosts, type BlogPost } from "@/lib/blog";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import "../../../app/globals.css";

async function fetchPosts() {
  const snapshot = await getDocs(collection(getFirebaseDb(), "posts"));
  return sortBlogPosts(
    snapshot.docs.map((postDocument) =>
      mapBlogPost(postDocument.id, postDocument.data()),
    ),
  );
}

function AdminPostsContent() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [],
  );

  useEffect(() => {
    let isActive = true;

    void fetchPosts()
      .then((nextPosts) => {
        if (isActive) setPosts(nextPosts);
      })
      .catch((loadError) => {
        console.error("관리자 게시글 목록을 불러오는 중 오류 발생:", loadError);
        if (isActive) setError("게시글 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [requestVersion]);

  const handleDelete = async (postId: string) => {
    if (!window.confirm("이 게시글을 삭제할까요? 삭제 후 복구할 수 없습니다.")) {
      return;
    }

    try {
      setDeletingId(postId);
      setActionError(null);
      await deleteDoc(doc(getFirebaseDb(), "posts", postId));
      setPosts((current) => current.filter((post) => post.id !== postId));
    } catch (deleteError) {
      console.error("게시글 삭제 중 오류 발생:", deleteError);
      setActionError("게시글을 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(getFirebaseAuth());
      await router.push("/admin/login");
    } catch (logoutError) {
      console.error("관리자 로그아웃 중 오류 발생:", logoutError);
      setActionError("로그아웃하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <section className="rounded-xl bg-white p-6 shadow-md md:p-10">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-sm font-semibold text-indigo-600">Blog Admin</p>
          <h1 className="mt-1 text-3xl font-bold">게시글 관리</h1>
          <p className="mt-2 text-gray-600">저장하면 블로그에 바로 공개됩니다.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/posts/new"
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700"
          >
            새 글 작성
          </Link>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            로그아웃
          </button>
        </div>
      </div>

      {actionError && (
        <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-700" role="alert">
          {actionError}
        </p>
      )}

      <div className="mt-8">
        {isLoading ? (
          <p className="py-12 text-center text-gray-500">게시글을 불러오고 있습니다.</p>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-6 text-red-700" role="alert">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setError(null);
                setRequestVersion((current) => current + 1);
              }}
              className="mt-4 rounded-lg border border-red-300 px-4 py-2 font-semibold transition hover:bg-red-100"
            >
              다시 시도
            </button>
          </div>
        ) : posts.length === 0 ? (
          <p className="rounded-lg bg-gray-50 py-12 text-center text-gray-500">
            아직 작성한 게시글이 없습니다.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold">{post.title}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {post.createdAt
                      ? dateFormatter.format(new Date(post.createdAt))
                      : "작성일 없음"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-3">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold transition hover:bg-gray-50"
                  >
                    수정
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleDelete(post.id)}
                    disabled={deletingId === post.id}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === post.id ? "삭제 중..." : "삭제"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default function AdminPosts() {
  return (
    <div>
      <Head>
        <title>게시글 관리 · 기술 블로그</title>
      </Head>
      <Navigation />
      <main className="min-h-screen bg-gray-100 px-6 pb-16 pt-28 text-gray-900">
        <div className="mx-auto max-w-5xl">
          <AdminGuard>
            <AdminPostsContent />
          </AdminGuard>
        </div>
      </main>
    </div>
  );
}
