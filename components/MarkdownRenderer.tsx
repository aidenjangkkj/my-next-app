"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

// 필요 시 허용 태그/속성 조금 확장
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [
      ...(defaultSchema.attributes?.code || []),
      // ```tsx 처럼 언어 지정 클래스 허용
      ["className"],
    ],
    span: [
      ...(defaultSchema.attributes?.span || []),
      ["className"],
    ],
  },
};

type Props = {
  content: string;
};

export default function MarkdownRenderer({ content }: Props) {
  return (
    <article className="prose prose-zinc max-w-none">
      <ReactMarkdown
        // GitHub Flavored Markdown (테이블, 체크박스, 자동링크 등)
        remarkPlugins={[remarkGfm]}
        // 코드 하이라이팅 + XSS 방지
        rehypePlugins={[
          [rehypeSanitize, schema],
          rehypeHighlight,
        ]}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
