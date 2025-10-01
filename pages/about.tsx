import Head from 'next/head';
import { FC } from 'react';
import '../app/globals.css';
import Navigation from '@/components/Navigation';

const About: FC = () => {
  return (
    <div>
      <Head>
        <title>소개 - 나의 포트폴리오</title>
        <meta
          name="description"
          content="웹·모바일·데스크톱 전반을 아우르는 프론트엔드 중심 풀스택 역량을 소개합니다."
        />
      </Head>

      <Navigation />

      <section className="py-16 bg-gray-100 text-gray-900 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-6xl mx-auto w-full px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">제가 하는 일</h2>
          <p className="text-center text-gray-600 mb-12">
            사용자 경험을 최우선으로, 웹·모바일·데스크톱까지 이어지는 제품을 설계하고 구현합니다.
          </p>

          {/* 핵심 역량 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">💻 프론트엔드 개발</h3>
              <p className="text-sm leading-relaxed">
                React · Next.js · TypeScript · Tailwind CSS로 반응형/접근성/성능을 고려해
                컴포넌트 기반 UI를 설계합니다. 데이터 연동과 상태 관리, SEO 기본도 함께 챙깁니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">📱 크로스 플랫폼</h3>
              <p className="text-sm leading-relaxed">
                React Native로 모바일 앱을, Electron으로 데스크톱 앱을 제작해
                하나의 서비스 경험이 여러 기기로 확장되도록 구현합니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">🗄️ 백엔드 & 데이터</h3>
              <p className="text-sm leading-relaxed">
                Spring Boot 기반 REST API와 MySQL/MariaDB를 다루며,
                Firebase(인증/실시간 DB/스토리지)로 빠른 프로토타이핑과 실시간 기능을 구현합니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">🤝 협업 & 실무 경험</h3>
              <p className="text-sm leading-relaxed">
                현장실습에서 팀장을 맡아 반응형 랜딩 페이지를 설계/병합/배포하고,
                디자이너와의 긴밀한 커뮤니케이션과 정기 발표로 품질을 개선했습니다.
              </p>
            </div>
          </div>

          {/* 대표 프로젝트 */}
          <h3 className="text-2xl font-bold mb-6 text-center">대표 프로젝트</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h4 className="text-lg font-semibold mb-2">🗺️ AI 여행 추천 웹서비스</h4>
              <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                <li>여행 스타일 입력 → AI 추천 → 구글맵 경로/표시 UI 구현</li>
                <li>React 컴포넌트 설계, 상태 관리, API 연동, 반응형 UI 구축</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h4 className="text-lg font-semibold mb-2">🍔 배달 플랫폼 유사 앱</h4>
              <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                <li>React Native(iOS/Android) → Electron(데스크톱)으로 확장</li>
                <li>역할 분리 UI(사용자/점주), Firebase 인증, 주문·배송 실시간 동기화</li>
              </ul>
            </div>
          </div>

          {/* 인턴십 하이라이트 */}
          <div className="mt-16 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <h4 className="text-lg font-semibold mb-2">🏢 인턴십 하이라이트 (2024.07–2024.08)</h4>
            <p className="text-sm text-gray-700">
              Bootstrap/React+Tailwind로 반응형 랜딩 페이지를 설계하고 팀 코드 병합을 주도했습니다.
              매주 진행 공유와 피드백 반영을 통해 디자인 일관성과 개발 효율을 높였습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
