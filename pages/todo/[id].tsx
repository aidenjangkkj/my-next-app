// pages/todo/[id].tsx
'use client';
import { useRouter } from 'next/router';
import React from 'react';

const TodoDetail: React.FC = () => {
  const router = useRouter();

  // 라우터가 준비되지 않은 경우 로딩 화면 표시
  if (!router.isReady) {
    return <div>Loading...</div>;
  }

  const { id } = router.query;

  // 실제 프로젝트에서는 id를 이용해 상세 정보를 API 호출 등을 통해 받아옵니다.
  return (
    <div style={{ padding: '20px' }}>
      <h1>Todo Detail</h1>
      <p>Todo ID: {id}</p>
    </div>
  );
};

export default TodoDetail;
