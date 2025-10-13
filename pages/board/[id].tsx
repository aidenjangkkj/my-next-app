import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GetServerSideProps } from "next";
import Navigation from "@/components/Navigation";
import "../../app/globals.css";
import dynamic from "next/dynamic";

const MarkdownRenderer = dynamic(
  () => import("@/components/MarkdownRenderer"),
  { ssr: true }
);

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO 문자열로 변환
}

interface PostProps {
  post: Post | null;
}

export default function PostDetail({ post }: PostProps) {
  return (
    <div>
      <Head>
        <title>{post ? `${post.title} - My Portfolio` : "게시글 없음"} </title>
        <meta
          name="description"
          content={post ? post.title : "게시글을 찾을 수 없습니다."}
        />
      </Head>
      <Navigation />
      <main className="pt-20 p-8 bg-white text-black min-h-screen">
        <div className="max-w-4xl mx-auto">
          {post ? (
            <>
              <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
              <p className="text-gray-500 mb-4">
                작성일: {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <MarkdownRenderer content={post.content} />
            </>
          ) : (
            <p>게시글을 찾을 수 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const docRef = doc(db, "posts", id as string);
  const docSnap = await getDoc(docRef);

  let post = null;
  if (docSnap.exists()) {
    const data = docSnap.data();
    post = {
      id: docSnap.id,
      title: data.title,
      content: data.content,
      // Firestore Timestamp를 ISO 문자열로 변환
      createdAt: data.createdAt.toDate().toISOString(),
    };
  }

  return {
    props: {
      post,
    },
  };
};
