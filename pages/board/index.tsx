import Head from "next/head";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import "../../app/globals.css";
import Navigation from "@/components/Navigation";

interface Post {
  id: string;
  title: string;
  content?: string;
  createdAt?: string;
}

const Board: FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const postsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title ?? "제목 없음",
            content: data.content,
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate().toISOString()
              : undefined,
          } satisfies Post;
        });
        setPosts(postsData);
      } catch (error) {
        console.error("게시글을 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <Head>
        <title>게시판 - My Portfolio</title>
        <meta name="description" content="My Portfolio의 게시판 페이지입니다." />
      </Head>
      <Navigation />
      <main className="pt-20 p-8 bg-white text-black min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">게시판</h2>
            <Link href="/board/new">
              <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition">
                새 글 작성
              </button>
            </Link>
          </div>
          {loading ? (
            <p className="text-center text-gray-500">로딩 중...</p>
          ) : posts.length > 0 ? (
            <ul>
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="p-4 border-b border-gray-300 hover:bg-gray-50 transition"
                >
                  <Link
                    href={`/board/${post.id}`}
                    className="block text-xl font-semibold hover:underline"
                  >
                    {post.title}
                  </Link>
                  <p className="text-gray-700 mt-2">
                    {post.content
                      ? `${post.content.slice(0, 80)}${
                          post.content.length > 80 ? "..." : ""
                        }`
                      : "내용이 없습니다."}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">게시글이 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Board;
