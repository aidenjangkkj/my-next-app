# My Next App

Next.js와 TypeScript, Tailwind CSS, Firebase 등을 활용해 제작한 개인 포트폴리오 사이트입니다.
이 프로젝트는 [create-next-app](https://nextjs.org)으로 부트스트랩되었으며, 최신 Next.js 기능들을 경험할 수 있습니다.

## 목차

- [소개](#소개)
- [기술 스택](#기술-스택)
- [설치 및 실행 방법](#설치-및-실행-방법)
- [프로젝트 구조](#프로젝트-구조)
- [사용 가능한 스크립트](#사용-가능한-스크립트)
- [배포](#배포)
- [GitHub 프로젝트 연동](#github-프로젝트-연동)
- [기여 방법](#기여-방법)
- [라이선스](#라이선스)
- [문의](#문의)

## 소개

이 프로젝트는 Next.js를 기반으로 한 개인 포트폴리오 사이트로, 빠른 개발 환경과 자동 코드 업데이트를 제공합니다.
Firebase를 통한 백엔드 연동과 Tailwind CSS를 이용한 스타일링을 통해 효율적인 UI/UX를 구현했습니다.

## 기술 스택

- **Next.js**: 최신 웹 프레임워크 (버전 15.1.7)
- **React**: 사용자 인터페이스 구성 (버전 ^19.0.0)
- **TypeScript**: 정적 타입 검사를 통한 코드 안정성 강화
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **Firebase**: 백엔드 서비스 연동
- **Turbopack**: 빠른 개발 서버 실행 (dev 스크립트에서 사용)

## 설치 및 실행 방법

### 1. 레포지토리 클론

```bash
git clone https://github.com/aidenjangkkj/my-next-app.git
cd my-next-app
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하면 개발 중인 애플리케이션을 확인할 수 있습니다.

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
.
├── app/                    # Next.js App Router 페이지
├── components/             # 재사용 가능한 UI 컴포넌트
├── data/                   # 정적 데이터 및 목업 데이터 소스
├── lib/                    # Firebase 및 기타 유틸리티 모듈
├── pages/                  # 기존 Pages Router 페이지 및 API 라우트
├── public/                 # 정적 자산 (이미지, 폰트 등)
├── next.config.ts          # Next.js 런타임 설정
├── package.json            # npm 스크립트 및 의존성 관리
└── tsconfig.json           # TypeScript 설정
```

## 사용 가능한 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | Turbopack을 이용해 개발 서버를 실행합니다. |
| `npm run build` | 프로덕션 빌드를 생성합니다. |
| `npm start` | 프로덕션 모드에서 서버를 실행합니다. |
| `npm run lint` | ESLint로 코드 품질 검사를 수행합니다. |

## 배포

### Vercel 자동 배포 파이프라인

레포지토리에 커밋을 푸시하면 자동으로 Vercel에 프로덕션 배포가 이뤄지도록 GitHub Actions 워크플로우를 추가했습니다. 설정 방법은 다음과 같습니다.

1. [Vercel 대시보드](https://vercel.com/)에서 새 프로젝트를 생성하고 GitHub 레포지토리를 연결합니다.
2. Vercel 프로젝트 설정의 **Settings → Environment Variables**에서 아래 세 가지 값을 확인합니다.
   - `VERCEL_TOKEN`: Vercel Personal Token (계정 **Settings → Tokens**에서 발급)
   - `VERCEL_ORG_ID`: 프로젝트가 속한 팀(혹은 개인)의 ID
   - `VERCEL_PROJECT_ID`: 프로젝트 ID
3. GitHub 레포지토리의 **Settings → Secrets and variables → Actions** 메뉴에서 위 세 값을 각각 `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` 이름으로 등록합니다.
4. 이후 `main` 브랜치로 푸시하거나, `Actions` 탭에서 **Deploy to Vercel** 워크플로우를 수동 실행하면 자동으로 프로덕션 배포가 진행됩니다.

워크플로우는 빌드 전에 `vercel pull`을 실행해 환경 변수를 동기화하고, 빌드 산출물을 `vercel deploy --prebuilt` 명령으로 프로덕션에 배포합니다.

### 수동 배포

Vercel CLI를 사용해 직접 배포할 수도 있습니다.

```bash
npm install --global vercel
vercel pull --yes --environment=production
npm run build
vercel deploy --prebuilt --prod
```

## GitHub 프로젝트 연동

프로젝트 페이지에서 GitHub 저장소 정보를 실시간으로 확인할 수 있도록 연동 기능을 추가했습니다. 아래 환경 변수를
`.env.local` 파일에 설정하면 `/api/github/projects` API를 통해 지정된 저장소 메타데이터가 노출됩니다.

| 변수명 | 설명 |
| --- | --- |
| `GITHUB_PROJECTS` | 표시하고 싶은 저장소 목록. `owner/repository` 형식으로 작성하며, 여러 개일 경우 쉼표로 구분합니다. |
| `GITHUB_ACCESS_TOKEN` *(선택)* | GitHub Personal Access Token. 비공개 저장소 접근 또는 API Rate Limit 완화가 필요한 경우 설정합니다. |
| `GITHUB_TOKEN` *(선택)* | GitHub Actions와 같이 기본 제공되는 토큰을 사용할 때 활용할 수 있는 대체 키 이름입니다. |

설정 예시는 다음과 같습니다.

```bash
GITHUB_PROJECTS=vercel/next.js,withastro/astro
GITHUB_ACCESS_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

환경 변수를 적용한 뒤 개발 서버를 재시작하면 프로젝트 목록 하단의 **GitHub Projects** 섹션에 저장소 카드가 표시됩니다. 개별 저장소의
별 수, 포크 수, 토픽, 대표 언어, 최근 커밋 시각 등의 정보가 자동으로 렌더링되며, 카드 하단의 버튼으로 GitHub 저장소 또는 배포된 데모를
바로 확인할 수 있습니다.

## 기여 방법

1. 이슈를 등록해 수정 또는 개선 사항을 공유합니다.
2. 새 브랜치를 생성한 후 수정 사항을 커밋합니다.
3. Pull Request를 보내 코드 리뷰를 진행합니다.

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 상세 내용은 `LICENSE` 파일을 참고하세요.

## 문의

프로젝트 관련 문의는 Issues 또는 이메일(`contact@example.com`)로 연락 바랍니다.
