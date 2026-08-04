# 포트폴리오 & 기술 블로그

Next.js 16, React 19, TypeScript, Tailwind CSS, Firebase로 만든 개인 포트폴리오와 기술 블로그입니다. 공개 방문자는 프로젝트와 글을 읽을 수 있고, 등록된 Google 계정 한 개만 관리자 화면에서 글을 작성·수정·삭제할 수 있습니다.

## 로컬 실행과 검증

Node.js와 npm을 준비한 뒤 저장소 루트에서 실행합니다.

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
```

주요 스크립트는 다음과 같습니다.

| 명령어 | 용도 |
| --- | --- |
| `npm run dev` | Turbopack 개발 서버 실행 |
| `npm test` | 블로그·인증·내비게이션 순수 로직 테스트 |
| `npm run lint` | ESLint 검사 |
| `npm run build` | 타입 검사를 포함한 프로덕션 빌드 |
| `npm start` | 생성된 프로덕션 빌드 실행 |

## 환경변수

필요한 이름은 [`.env.example`](./.env.example)에 있습니다. 로컬 값은 `.env.local`에 넣고 커밋하지 않습니다.

- `NEXT_PUBLIC_FIREBASE_*`: Firebase 웹 앱 설정과 Firestore·Authentication 연결에 필요합니다. 브라우저에 포함되는 공개 설정이므로 이 값 자체를 권한 제어 수단으로 사용하지 않습니다.
- `SMTP_*`, `CONTACT_TO`, `CONTACT_FROM`: 연락 폼 메일 전송에 사용합니다.
- `GITHUB_PROJECTS`: `owner/repository` 형식의 저장소를 쉼표로 구분합니다.
- `GITHUB_ACCESS_TOKEN`: 비공개 저장소 조회 또는 GitHub API 호출 한도 완화가 필요할 때만 설정합니다.

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
| `/blog` | 공개 기술 블로그 목록 |
| `/blog/[id]` | 공개 게시글 상세 |
| `/admin/login` | Google 관리자 로그인 |
| `/admin/posts` | 관리자 게시글 목록·삭제 |
| `/admin/posts/new` | 작성일을 지정해 새 글 즉시 공개 |
| `/admin/posts/[id]/edit` | 제목·본문·작성일 수정 |

기존 `/board`와 `/board/[id]` 주소는 대응하는 `/blog` 주소로 리다이렉트됩니다. 기존 Firestore `posts` 문서는 별도 마이그레이션 없이 읽을 수 있으며, `createdAt`이 없는 문서는 작성일 미정으로 표시됩니다. `updatedAt`은 해당 글을 관리자 화면에서 처음 수정한 뒤부터 기록됩니다.

## 구조

- `pages/`: 포트폴리오, 블로그, 관리자, API를 제공하는 Pages Router 경로
- `components/`: 내비게이션, Markdown 렌더러, 관리자 가드, 글 폼
- `lib/`: Firebase 초기화와 블로그·인증 도메인 로직
- `data/`: 프로젝트 정적 데이터
- `app/`: 전역 스타일과 Next.js 루트 보조 파일
- `firestore.rules`: 기존 Production Rules와 병합할 블로그 권한 규칙
