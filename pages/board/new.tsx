import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import '../../app/globals.css';
export default function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        createdAt: new Date()
      });
      router.push('/board');
    } catch (error) {
      console.error('게시글 저장 중 오류 발생:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">새 글 작성</h1>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col">
        <input
          className="border p-2 rounded mb-2"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 rounded mb-2"
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          게시글 저장
        </button>
      </form>
    </div>
  );
}
