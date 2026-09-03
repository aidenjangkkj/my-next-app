# 장석환 · Frontend Developer 포트폴리오

Next.js 16, React 19, TypeScript, Tailwind CSS, Firebase로 만든 Pages Router 포트폴리오입니다. 광고·리워드 WebView 제품에서 다룬 API 요청, 모델 캐시, Native callback과 Config 계약을 경력과 글로 정리했습니다. 메뉴는 홈·경력·개인 프로젝트·글입니다.

모든 글은 기존 관리자에서 작성·수정하며 Firestore의 Markdown 본문을 그대로 표시합니다. API 최적화·정적 리소스 캐시 글은 기존 주소와 작성일을 유지하고 본문에 검증 결과를 추가했습니다. Native callback·Config 글도 같은 관리자에서 등록했습니다. 코드에는 홈·경력에서 연결할 제목·요약·글 ID만 유지하며, 별도 정적 글이나 본문 보강 컴포넌트는 없습니다. Firestore 스키마와 권한 규칙은 변경하지 않았습니다.

## 로컬 실행과 검증

Node.js 22.13 이상과 npm을 준비한 뒤 저장소 루트에서 실행합니다. 테스트는 Node의 TypeScript strip 기능을 사용합니다.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

로컬 주소는 `http://localhost:3000`입니다. 변경 전후에는 다음 명령으로 검증합니다.

```bash
npm test
npm run lint
npm run build
npm run test:static
```

주요 스크립트는 다음과 같습니다.

| 명령어 | 용도 |
| --- | --- |
| `npm run dev` | Turbopack 개발 서버 실행 |
| `npm test` | 콘텐츠 ID/slug·조회·연결, 링크, canonical, 연락 입력·escape, 블로그·인증·내비게이션 테스트 |
| `npm run lint` | ESLint 검사 |
| `npm run build` | 타입 검사를 포함한 프로덕션 빌드 |
| `npm run test:static` | 빌드 후 생성 HTML의 콘텐츠·링크·SEO·정적 페이지 검사 |
| `npm start` | 생성된 프로덕션 빌드 실행 |

제한된 실행 환경에서 Turbopack의 보조 프로세스 포트 바인딩이 차단되면 `npm run build -- --webpack`으로 같은 소스를 검증할 수 있습니다. 이후 `npm run test:static`을 실행합니다.

## CI와 배포

GitHub Actions는 master push와 master 대상 pull request에서 테스트·린트·프로덕션 빌드·정적 HTML 검사를 실행합니다. 공개 배포는 Vercel Git 연동에서만 수행하며, Actions에는 배포 토큰이 필요하지 않습니다.

공개 사이트: [장석환 포트폴리오](https://jang-portfolio-one-chi.vercel.app/)

## 환경변수

필요한 이름은 [`.env.example`](./.env.example)에 있습니다. 로컬 값은 `.env.local`에 넣고 커밋하지 않습니다.

- `NEXT_PUBLIC_FIREBASE_*`: Firebase 웹 앱 설정과 Firestore·Authentication 연결에 필요합니다. 브라우저에 포함되는 공개 설정이므로 이 값 자체를 권한 제어 수단으로 사용하지 않습니다.
- `SMTP_*`, `CONTACT_TO`, `CONTACT_FROM`: 연락 폼 메일 전송에 사용합니다.
- `NEXT_PUBLIC_SITE_URL`: canonical·Open Graph URL의 기준 origin입니다. 미설정·잘못된 값이면 `https://jang-portfolio-one-chi.vercel.app`을 사용합니다. 빌드 시점에 적용합니다.

프로젝트는 정적 import/SSG로 렌더링하며 런타임 GitHub API를 사용하지 않습니다. 이전 `GITHUB_PROJECTS`, `GITHUB_ACCESS_TOKEN`은 더 이상 필요하지 않습니다. 기존 배포 환경의 값은 운영자가 별도로 제거할 수 있으며 이 작업에서 배포 환경을 변경하지 않았습니다.

연락 폼은 서버에서 타입·길이(이름 100, 이메일 254, 메시지 5,000자)·이메일·honeypot을 검증하고 HTML을 escape합니다. 메모리 Map 제한은 인스턴스별로만 동작하며 분산 rate limit을 보장하지 않습니다. SMTP가 설정되지 않으면 전송하지 않고 503을 반환합니다.

Vercel에서는 프로젝트의 **Settings → Environment Variables**에서 Firebase 변수 6개를 Production, Preview, Development에 각각 등록합니다. Preview나 Development가 별도 Firebase 프로젝트를 사용한다면 환경별 값을 분리합니다. 환경변수 변경은 이전 배포에 소급되지 않으므로 변경 후 재배포해야 합니다. 로컬로 Development 값을 내려받을 때는 `vercel env pull`을 사용할 수 있습니다. 자세한 내용은 [Vercel 환경변수 문서](https://vercel.com/docs/environment-variables)를 참고하세요.

## Firebase 관리자 설정

### 1. Google 로그인 활성화

Firebase Console의 **Security → Authentication → Sign-in method**에서 Google 공급자를 활성화합니다. **Authorized domains**에는 `localhost`와 실제로 로그인에 사용할 Vercel Production·Preview 도메인을 정확히 등록합니다. 사용하지 않는 도메인은 추가하지 않습니다. 절차는 [Firebase Google 로그인 문서](https://firebase.google.com/docs/auth/web/google-signin)를 참고하세요.

### 2. 관리자 UID 등록

관리자로 사용할 Google 계정은 하나만 등록합니다.

1. 배포된 `/admin/login`에서 해당 Google 계정으로 한 번 로그인합니다.
2. 첫 로그인은 아직 관리자 문서가 없으므로 권한 없음 화면이 정상입니다.
3. Firebase Console의 **Authentication → Users**에서 해당 사용자의 UID를 복사합니다.
4. Firestore Data 화면에서 `admins` 컬렉션을 만들고, 복사한 UID를 문서 ID로 사용해 빈 문서 또는 설명 필드가 있는 문서를 하나 생성합니다.
5. `/admin/posts`를 새로 열어 관리자 화면 접근을 확인합니다.

관리자를 바꿀 때는 기존 `admins/{uid}` 문서를 제거한 뒤 새 UID 문서 하나만 생성합니다. 애플리케이션 코드나 Vercel 환경변수에 관리자 이메일을 추가할 필요는 없습니다.

### 3. Firestore Security Rules 반영

[`firestore.rules`](./firestore.rules)는 `posts` 공개 읽기와 `admins/{uid}` 문서가 있는 인증 사용자만 쓰기를 허용합니다. 이 파일은 저장소의 다른 컬렉션 규칙을 알 수 없으므로 그대로 배포하지 마세요.

1. Firebase Console의 현재 Production Rules를 먼저 별도 파일에 백업합니다.
2. 기존 규칙에 `isAdmin`, `/admins/{uid}`, `/posts/{postId}` 부분을 병합합니다.
3. Rules Playground 또는 Emulator에서 공개 읽기, 비로그인 쓰기 거부, 관리자 CRUD를 확인합니다.
4. 검증한 병합본만 배포합니다.

Firebase CLI로 규칙을 배포하면 Console의 기존 규칙을 덮어쓰므로 특히 주의해야 합니다. 자세한 내용은 [Cloud Firestore Security Rules 문서](https://firebase.google.com/docs/firestore/security/get-started)를 참고하세요.

## 주요 경로

| 경로 | 용도 |
| --- | --- |
| `/` | 전문 영역, 주요 글과 경력·개인 프로젝트. 정량 수치는 글 본문에만 배치 |
| `/experience` | 익명화한 경력 프로젝트 네 영역 |
| `/case-studies` | 통합 글 목록 `/blog`로 영구 리다이렉트 |
| `/case-studies/[slug]` | 알려진 세 주소를 해당 `/blog/[id]`로 영구 리다이렉트, 없는 slug는 404 |
| `/projects` | 선별 개인 프로젝트 2개, 클라이언트 데이터 fetch 없음 |
| `/projects/archive` | 이전 프로젝트 14개의 보관 목록 |
| `/projects/[id]` | 선별·보관 프로젝트 SSG 상세, 없는 ID는 404 |
| `/blog` | Firestore에 저장된 글 목록만 표시 |
| `/blog/[id]` | 관리자가 저장한 Markdown 본문 표시 |
| `/admin/login` | Google 관리자 로그인 |
| `/admin/posts` | 관리자 게시글 목록·삭제 |
| `/admin/posts/new` | 작성일을 지정해 새 글 즉시 공개 |
| `/admin/posts/[id]/edit` | 제목·본문·작성일 수정 |
| `/contact` | 연락 폼, 메일 발송은 서버 API 사용 |

기존 `/about`은 `/experience`로 영구 리다이렉트합니다. `/board`와 `/board/[id]`의 `/blog` 리다이렉트와 `/board/new`의 관리자 작성 화면 이동은 유지합니다. 기존 Firestore `posts` 문서는 별도 마이그레이션 없이 읽을 수 있으며, `createdAt`이 없는 문서는 작성일 미정으로 표시됩니다. `updatedAt`은 해당 글을 관리자 화면에서 처음 수정한 뒤부터 기록됩니다.

## 구조

- `pages/`: Pages Router. `_app.tsx`가 공통 레이아웃과 전역 CSS를 한 번 적용하고 `_document.tsx`는 한국어 문서와 favicon을 설정합니다.
- `components/`: 기존 Navigation·관리자 가드·글 폼·Markdown 렌더러와 공통 SEO·카드
- `lib/`: Firebase·블로그·인증 로직, canonical·연락 검증 helper
- `data/experience.ts`: 익명화된 경력 네 영역과 관련 기술 사례
- `data/caseStudies.ts`: 홈·경력 링크용 `slug`, `title`, `summary`, `postId`, `relatedProjectIds`. 본문은 보관하지 않습니다. 기존 사례 주소의 리다이렉트에도 같은 글 ID를 사용합니다.
- `data/projects.ts`: 선별/보관 프로젝트·정적 조회·선택적 외부 링크. 빈 링크는 렌더링하지 않습니다.
- `styles/globals.css`, `public/favicon.ico`: 공통 스타일과 정적 아이콘. 미사용 App Router scaffold는 제거했습니다.
- `firestore.rules`: 기존 Production Rules와 병합할 블로그 권한 규칙

## 공개 콘텐츠의 경계

- 고객사명은 ‘대형 포인트 앱’·‘고객사 포인트 앱’, 내부 namespace는 일반적인 ‘공통 광고·WebView 패키지’로 표시합니다. 공개 여부를 결정할 위치는 `data/experience.ts`와 `data/caseStudies.ts`입니다.
- 회사 내부 소스·운영 로그 원문·commit SHA·API 주소·광고 ID·AWS 정보는 반입하지 않습니다.
- `3→1`은 동일 조건 로컬 전후 재현, `1→0`은 동일 기기·모델 revision 한 쌍의 fetch 관측, `10초`는 resume 기준 설정입니다. 전체 트래픽·속도·장애율로 일반화하지 않습니다.
- 개인 프로젝트 설명은 공개 코드/README를 대조했습니다. 모의 데이터, 외부 API 의존성, 웹 측 코드 부재 등의 한계를 상세에 표시하며 기간을 확인하지 못한 경우 추정하지 않습니다.
- 기존 캐시 글의 `no-store` 설명과 후속 `force-cache` 보완은 구현 시점이 다른 내용임을 본문에 명시했습니다. 두 기존 글은 원문을 백업한 뒤 본문 끝에 검증 문단만 추가했습니다.
- 블로그는 Markdown/GFM·코드 하이라이팅·sanitize를 유지합니다. 운영 관리자에서 기존 글 2개 수정과 새 글 1개 작성·공개를 확인했습니다. 글 삭제, 비관리자 쓰기 거부, 실제 SMTP 발송은 이번 검증에서 실행하지 않았습니다.

## 글 작성·수정

새 글은 `/admin/posts/new`, 기존 글은 `/admin/posts`에서 해당 글의 수정 링크로 관리합니다. 저장하면 즉시 공개되므로 운영 글 수정 전에는 원문을 별도 백업합니다. 본문 수정에는 코드 수정이나 재배포가 필요하지 않습니다.

홈·경력에 새 추천 글을 연결할 때만 `data/caseStudies.ts`의 링크 메타데이터를 수정합니다. 글 제목을 바꾸면 해당 메타데이터도 함께 갱신해야 합니다. 공개된 세 글의 ID는 다음과 같습니다.

| 글 | ID |
| --- | --- |
| API 중복 호출 최적화 | `CUVhkjAaSRgVCZ7UtpDb` |
| Service Worker와 Cache Storage로 정적 리소스 캐싱하기 | `LTXMexwiS1ALARfmq8JC` |
| WebView 광고 callback 누락과 Config 오류 처리 | `KBqgU4z8g8cw0hTYYTdS` |

## 라우트 정리 후 생성 캐시

라우트를 삭제한 뒤 기존 `.next/dev/types`가 없는 파일을 참조하면 개발 서버를 종료하고 해당 **생성 캐시만** 비운 뒤 다시 빌드합니다. 소스 타입 검사를 끄지 않습니다. 새 checkout이나 새 생성 캐시에서는 별도 작업이 필요하지 않습니다.
