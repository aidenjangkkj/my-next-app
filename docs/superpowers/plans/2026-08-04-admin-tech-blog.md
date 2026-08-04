# Admin Tech Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the public Firebase board into a portfolio-integrated technical blog with Google sign-in, one UID-backed administrator, CRUD, editable publication dates, responsive UI, and Firestore-enforced write access.

**Architecture:** Keep the Pages Router and Firebase client SDK already used by the project. Public blog pages read the existing `posts` collection, while admin pages use Google Authentication and require an `admins/{uid}` document; Firestore Rules are the security boundary. Shared pure helpers normalize legacy post data, validate form input, and handle local date values so they can be tested with Node's built-in test runner.

**Tech Stack:** Next.js 16 Pages Router, React 19, TypeScript, Tailwind CSS 3, Firebase Authentication and Firestore, react-markdown, Node.js test runner.

---

## Target file map

- `lib/firebase-config.ts`: read and validate Firebase public configuration without initializing Firebase.
- `lib/firebase.ts`: lazily initialize Firebase and expose `getFirebaseDb()` and `getFirebaseAuth()`.
- `lib/blog.ts`: shared blog types, legacy document normalization, sorting, excerpts, date conversion, and input validation.
- `lib/admin.ts`: pure administrator access-state decision.
- `components/AdminGuard.tsx`: observe Firebase Authentication and verify `admins/{uid}`.
- `components/PostForm.tsx`: shared create/edit form with title, publication date, and Markdown body.
- `pages/admin/login.tsx`: Google login and unauthorized-account feedback.
- `pages/admin/posts/index.tsx`: administrator list, delete, and logout.
- `pages/admin/posts/new.tsx`: create a post and publish immediately.
- `pages/admin/posts/[id]/edit.tsx`: load and update an existing post.
- `pages/blog/index.tsx`: public blog list rendered from Firestore.
- `pages/blog/[id].tsx`: public article detail.
- `pages/board/index.tsx`, `pages/board/[id].tsx`, `pages/board/new.tsx`: compatibility redirects.
- `components/Navigation.tsx`: responsive navigation, active state, and Blog label.
- `components/MarkdownRenderer.tsx`, `app/globals.css`: readable article and code-block styling.
- `firestore.rules`: UID-backed administrator rule set to merge with the deployed rules.
- `.env.example`, `README.md`: environment, Firebase Console, rules, and administrator bootstrap instructions.
- `tests/*.test.ts`: dependency-free tests for configuration, blog data, date handling, and access-state logic.

## Task 1: Restore the toolchain and make Firebase initialization lazy

**Files:**
- Create: `tests/firebase-config.test.ts`
- Create: `lib/firebase-config.ts`
- Modify: `lib/firebase.ts`
- Modify: `pages/board/index.tsx`
- Modify: `pages/board/[id].tsx`
- Modify: `pages/board/new.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `eslint.config.mjs`
- Modify: `tsconfig.json`

- [ ] **Step 1: Update supported dependencies and verification scripts**

Run:

```bash
npm install next@16.3.0 eslint-config-next@16.3.0 firebase@12.17.0 nodemailer@9.0.3
```

Update `package.json` scripts to:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "node --experimental-strip-types --test tests/*.test.ts"
  }
}
```

Add a global ignore object before the compatibility presets in `eslint.config.mjs`:

```js
const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "coverage/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];
```

Set `compilerOptions.jsx` to `react-jsx`, set `compilerOptions.allowImportingTsExtensions` to `true`, and include `.next/dev/types/**/*.ts` in `tsconfig.json` so Next does not rewrite the file during verification and TypeScript accepts the explicit `.ts` imports used by the Node tests.

- [ ] **Step 2: Write the failing Firebase configuration test**

Create `tests/firebase-config.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  getMissingFirebaseConfigKeys,
  type FirebasePublicConfig,
} from "../lib/firebase-config.ts";

const completeConfig: FirebasePublicConfig = {
  apiKey: "key",
  authDomain: "example.firebaseapp.com",
  projectId: "example",
  storageBucket: "example.appspot.com",
  messagingSenderId: "123",
  appId: "1:123:web:abc",
};

test("returns no missing keys for a complete Firebase config", () => {
  assert.deepEqual(getMissingFirebaseConfigKeys(completeConfig), []);
});

test("returns every empty Firebase config key", () => {
  assert.deepEqual(
    getMissingFirebaseConfigKeys({ ...completeConfig, apiKey: "", projectId: undefined }),
    ["apiKey", "projectId"],
  );
});
```

- [ ] **Step 3: Run the test and verify RED**

Run:

```bash
npm test
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `lib/firebase-config.ts`.

- [ ] **Step 4: Implement the minimal configuration helper**

Create `lib/firebase-config.ts`:

```ts
export interface FirebasePublicConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const configKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
] as const;

export function getMissingFirebaseConfigKeys(config: FirebasePublicConfig) {
  return configKeys.filter((key) => !config[key]?.trim());
}
```

- [ ] **Step 5: Replace eager Firebase exports with lazy getters**

Replace `lib/firebase.ts` with:

```ts
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMissingFirebaseConfigKeys } from "./firebase-config";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: FirebaseApp | undefined;

export function getFirebaseApp() {
  const missingKeys = getMissingFirebaseConfigKeys(firebaseConfig);
  if (missingKeys.length > 0) {
    throw new Error(`Firebase 환경 변수가 누락되었습니다: ${missingKeys.join(", ")}`);
  }

  firebaseApp ??= getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return firebaseApp;
}

export const getFirebaseDb = () => getFirestore(getFirebaseApp());
export const getFirebaseAuth = () => getAuth(getFirebaseApp());
```

Change current board call sites from a module-level `db` import to `getFirebaseDb()` inside `useEffect`, `handleSubmit`, or `getServerSideProps`. For example:

```ts
import { getFirebaseDb } from "@/lib/firebase";

const querySnapshot = await getDocs(collection(getFirebaseDb(), "posts"));
```

- [ ] **Step 6: Verify GREEN and the restored baseline**

Run:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Expected: all commands exit 0 without Firebase environment variables. The public board can show a configuration error at runtime, but importing it must not fail the build.

- [ ] **Step 7: Commit Task 1**

```bash
git add package.json package-lock.json eslint.config.mjs tsconfig.json tests/firebase-config.test.ts lib/firebase-config.ts lib/firebase.ts pages/board
git commit -m "fix: restore build and lazy Firebase setup"
```

## Task 2: Add tested blog normalization, date, and validation logic

**Files:**
- Create: `tests/blog.test.ts`
- Create: `lib/blog.ts`

- [ ] **Step 1: Write failing blog-domain tests**

Create `tests/blog.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  createExcerpt,
  fromDateTimeLocal,
  mapBlogPost,
  sortBlogPosts,
  toDateTimeLocal,
  validatePostInput,
} from "../lib/blog.ts";

const timestamp = (value: string) => ({ toDate: () => new Date(value) });

test("maps a legacy post with optional dates", () => {
  assert.deepEqual(
    mapBlogPost("post-1", {
      title: "  제목  ",
      content: "본문",
      createdAt: timestamp("2026-08-01T03:00:00.000Z"),
    }),
    {
      id: "post-1",
      title: "제목",
      content: "본문",
      createdAt: "2026-08-01T03:00:00.000Z",
      updatedAt: null,
    },
  );
});

test("sorts missing publication dates last", () => {
  const posts = [
    { id: "none", title: "없음", content: "", createdAt: null, updatedAt: null },
    { id: "old", title: "과거", content: "", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: null },
    { id: "new", title: "최근", content: "", createdAt: "2026-08-01T00:00:00.000Z", updatedAt: null },
  ];
  assert.deepEqual(sortBlogPosts(posts).map(({ id }) => id), ["new", "old", "none"]);
});

test("validates title, content, and publication date", () => {
  assert.equal(validatePostInput({ title: " ", content: "본문", createdAt: "2026-08-01T12:00" }), "제목을 입력해 주세요.");
  assert.equal(validatePostInput({ title: "제목", content: " ", createdAt: "2026-08-01T12:00" }), "내용을 입력해 주세요.");
  assert.equal(validatePostInput({ title: "제목", content: "본문", createdAt: "invalid" }), "올바른 작성일을 입력해 주세요.");
  assert.equal(validatePostInput({ title: "제목", content: "본문", createdAt: "2026-08-01T12:00" }), null);
});

test("round-trips a local datetime value", () => {
  const date = new Date(2026, 7, 1, 12, 30);
  assert.equal(toDateTimeLocal(date), "2026-08-01T12:30");
  assert.equal(fromDateTimeLocal("2026-08-01T12:30")?.getTime(), date.getTime());
});

test("creates a plain-text excerpt", () => {
  assert.equal(createExcerpt("# 제목\n\n**강조된 본문**입니다.", 12), "제목 강조된 본문입니다…");
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run `npm test`.

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `lib/blog.ts`.

- [ ] **Step 3: Implement `lib/blog.ts`**

```ts
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PostFormValues {
  title: string;
  content: string;
  createdAt: string;
}

type TimestampLike = { toDate: () => Date };

function toIsoString(value: unknown) {
  if (!value || typeof value !== "object" || !("toDate" in value)) return null;
  const date = (value as TimestampLike).toDate();
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function mapBlogPost(id: string, data: Record<string, unknown>): BlogPost {
  return {
    id,
    title: typeof data.title === "string" && data.title.trim() ? data.title.trim() : "제목 없음",
    content: typeof data.content === "string" ? data.content : "",
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  };
}

export function sortBlogPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => {
    if (!a.createdAt) return b.createdAt ? 1 : 0;
    if (!b.createdAt) return -1;
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });
}

export function validatePostInput(values: PostFormValues) {
  if (!values.title.trim()) return "제목을 입력해 주세요.";
  if (!values.content.trim()) return "내용을 입력해 주세요.";
  if (!fromDateTimeLocal(values.createdAt)) return "올바른 작성일을 입력해 주세요.";
  return null;
}

export function toDateTimeLocal(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDateTimeLocal(value: string) {
  const date = new Date(value);
  return value && !Number.isNaN(date.getTime()) ? date : null;
}

export function createExcerpt(markdown: string, maxLength = 120) {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`#>*_~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plainText.length > maxLength ? `${plainText.slice(0, maxLength).trim()}…` : plainText;
}
```

- [ ] **Step 4: Verify GREEN**

Run:

```bash
npm test
npm run lint
npx tsc --noEmit
```

Expected: all commands exit 0.

- [ ] **Step 5: Commit Task 2**

```bash
git add tests/blog.test.ts lib/blog.ts
git commit -m "feat: add tested blog domain helpers"
```

## Task 3: Implement Google login and UID-backed admin access

**Files:**
- Create: `tests/admin.test.ts`
- Create: `lib/admin.ts`
- Create: `components/AdminGuard.tsx`
- Create: `pages/admin/login.tsx`

- [ ] **Step 1: Write the failing access-state test**

Create `tests/admin.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { getAdminAccessState } from "../lib/admin.ts";

test("reports each administrator access state predictably", () => {
  assert.equal(getAdminAccessState(true, false, false), "checking");
  assert.equal(getAdminAccessState(false, false, false), "signed-out");
  assert.equal(getAdminAccessState(false, true, false), "forbidden");
  assert.equal(getAdminAccessState(false, true, true), "allowed");
});
```

- [ ] **Step 2: Run the test and verify RED**

Run `npm test`.

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `lib/admin.ts`.

- [ ] **Step 3: Implement the pure access decision**

Create `lib/admin.ts`:

```ts
export type AdminAccessState = "checking" | "signed-out" | "forbidden" | "allowed";

export function getAdminAccessState(
  checking: boolean,
  signedIn: boolean,
  hasAdminDocument: boolean,
): AdminAccessState {
  if (checking) return "checking";
  if (!signedIn) return "signed-out";
  return hasAdminDocument ? "allowed" : "forbidden";
}
```

- [ ] **Step 4: Implement `AdminGuard`**

`components/AdminGuard.tsx` must:

```tsx
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import { getAdminAccessState } from "@/lib/admin";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
```

On mount, call `onAuthStateChanged(getFirebaseAuth(), ...)`, read `admins/{user.uid}` with `getDoc`, and map the result through `getAdminAccessState`. Render exactly these outcomes:

- `checking`: `관리자 권한을 확인하고 있습니다.`
- `signed-out`: a link to `/admin/login`
- `forbidden`: `이 계정에는 관리자 권한이 없습니다.` and a logout button
- `allowed`: render `children`
- Firebase/config error: `관리자 인증을 초기화하지 못했습니다.` with `role="alert"`

Return the unsubscribe function from the effect and do not render protected children before `allowed`.

- [ ] **Step 5: Implement the Google login page**

`pages/admin/login.tsx` must call:

```ts
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
await signInWithPopup(getFirebaseAuth(), provider);
await router.push("/admin/posts");
```

Render one Google login button, disable it while the popup is active, ignore `auth/popup-closed-by-user`, and show other errors with `role="alert"`. Include `Head`, `Navigation`, and a link back to `/blog`.

- [ ] **Step 6: Verify and commit Task 3**

Run:

```bash
npm test
npm run lint
npx tsc --noEmit
```

Expected: all commands exit 0.

Commit:

```bash
git add tests/admin.test.ts lib/admin.ts components/AdminGuard.tsx pages/admin/login.tsx
git commit -m "feat: add Google blog admin access"
```

## Task 4: Build the shared form and administrator CRUD pages

**Files:**
- Create: `components/PostForm.tsx`
- Create: `pages/admin/posts/index.tsx`
- Create: `pages/admin/posts/new.tsx`
- Create: `pages/admin/posts/[id]/edit.tsx`

- [ ] **Step 1: Implement the shared form against tested domain functions**

`components/PostForm.tsx` accepts:

```ts
interface PostFormProps {
  initialValues: PostFormValues;
  submitLabel: string;
  onSubmit: (values: PostFormValues) => Promise<void>;
}
```

The component owns current values, submission state, and an error string. On submit it calls `validatePostInput`; if valid it passes trimmed title/content and the unchanged local datetime to `onSubmit`. Render labeled inputs with `id="title"`, `id="createdAt"`, and `id="content"`, using `type="datetime-local"` for the date. Disable the submit button while awaiting the promise and render errors with `role="alert"`.

- [ ] **Step 2: Implement immediate publication**

`pages/admin/posts/new.tsx` wraps the page in `AdminGuard`, initializes:

```ts
const initialValues = {
  title: "",
  content: "",
  createdAt: toDateTimeLocal(new Date()),
};
```

Submit with:

```ts
const createdAt = fromDateTimeLocal(values.createdAt);
if (!createdAt) throw new Error("올바른 작성일을 입력해 주세요.");

await addDoc(collection(getFirebaseDb(), "posts"), {
  title: values.title,
  content: values.content,
  createdAt: Timestamp.fromDate(createdAt),
});
await router.push("/admin/posts");
```

- [ ] **Step 3: Implement post editing**

`pages/admin/posts/[id]/edit.tsx` waits for `router.isReady`, loads `posts/{id}`, maps it with `mapBlogPost`, and fills `PostForm`. Convert an existing ISO date through `toDateTimeLocal(new Date(post.createdAt))`; if absent, use the current date.

Update with:

```ts
await updateDoc(doc(getFirebaseDb(), "posts", postId), {
  title: values.title,
  content: values.content,
  createdAt: Timestamp.fromDate(createdAt),
  updatedAt: serverTimestamp(),
});
```

If the document does not exist, display `수정할 게시글을 찾을 수 없습니다.` with a link to `/admin/posts`.

- [ ] **Step 4: Implement administrator list and deletion**

`pages/admin/posts/index.tsx` must:

- wrap all Firestore content in `AdminGuard`
- read all `posts`, map with `mapBlogPost`, and sort with `sortBlogPosts`
- render title, formatted creation date, edit link, and delete button
- show loading, empty, and retryable error states
- call `window.confirm("이 게시글을 삭제할까요? 삭제 후 복구할 수 없습니다.")`
- call `deleteDoc(doc(getFirebaseDb(), "posts", id))` only after confirmation
- remove the item from state only after Firestore succeeds
- offer `signOut(getFirebaseAuth())` and route to `/admin/login`

- [ ] **Step 5: Verify and commit Task 4**

Run:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Expected: all commands exit 0 without local Firebase values; admin routes render a controlled configuration error rather than failing the build.

Commit:

```bash
git add components/PostForm.tsx pages/admin
git commit -m "feat: add blog post administration"
```

## Task 5: Replace the public board with the technical blog

**Files:**
- Create: `pages/blog/index.tsx`
- Create: `pages/blog/[id].tsx`
- Modify: `pages/board/index.tsx`
- Modify: `pages/board/[id].tsx`
- Modify: `pages/board/new.tsx`

- [ ] **Step 1: Implement the public blog list**

Use `getServerSideProps` in `pages/blog/index.tsx` to read all posts with `getFirebaseDb()`, map and sort them, and return serializable `BlogPost[]`. If Firebase is unavailable, set `context.res.statusCode = 503` and return an `error` prop rather than throwing.

Render:

- `<h1>기술 블로그</h1>`
- a short description connecting technical writing to portfolio work
- an error panel when the prop contains an error
- an empty state when there are no posts
- a semantic `<ol>` of article links otherwise
- title, Korean creation date or `작성일 미정`, and `createExcerpt(content)`

Each link targets `/blog/${post.id}` and has a visible keyboard focus state.

- [ ] **Step 2: Implement the public article detail**

Use `getServerSideProps` in `pages/blog/[id].tsx`. Return `{ notFound: true }` for a missing document. For Firestore/config errors, set status 503 and return an error prop.

Render the mapped post with:

```tsx
<h1>{post.title}</h1>
<time dateTime={post.createdAt ?? undefined}>작성일: {formattedCreatedAt}</time>
{post.updatedAt && <time dateTime={post.updatedAt}>수정일: {formattedUpdatedAt}</time>}
<MarkdownRenderer content={post.content} />
```

Include a link back to `/blog` and derive the `Head` description from `createExcerpt(post.content, 150)`.

- [ ] **Step 3: Replace old board routes with redirects**

Each old page exports only a redirecting `getServerSideProps` and an empty component:

```tsx
export default function BoardRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: "/blog", permanent: true },
});
```

For `pages/board/[id].tsx`, preserve the ID in `/blog/${id}`. Redirect `pages/board/new.tsx` to `/admin/posts/new` with `permanent: false`.

- [ ] **Step 4: Verify and commit Task 5**

Run:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Expected: all commands exit 0. In a configured environment, existing Firestore documents appear under `/blog` without migration.

Commit:

```bash
git add pages/blog pages/board
git commit -m "feat: turn board into public tech blog"
```

## Task 6: Improve navigation, article readability, and accessibility

**Files:**
- Create: `tests/navigation.test.ts`
- Create: `lib/navigation.ts`
- Modify: `components/Navigation.tsx`
- Modify: `components/MarkdownRenderer.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Write the failing active-navigation test**

Create `tests/navigation.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { isActiveNavigationItem } from "../lib/navigation.ts";

test("matches the home route exactly and nested sections by prefix", () => {
  assert.equal(isActiveNavigationItem("/", "/"), true);
  assert.equal(isActiveNavigationItem("/projects/demo", "/"), false);
  assert.equal(isActiveNavigationItem("/blog/post-1", "/blog"), true);
  assert.equal(isActiveNavigationItem("/contact", "/blog"), false);
});
```

- [ ] **Step 2: Verify RED and implement the helper**

Run `npm test` and expect `ERR_MODULE_NOT_FOUND` for `lib/navigation.ts`.

Create `lib/navigation.ts`:

```ts
export function isActiveNavigationItem(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
```

- [ ] **Step 3: Rebuild `Navigation` responsively**

Use `useRouter()` and local `menuOpen` state. Define exactly these public items:

```ts
const navigationItems = [
  { href: "/", label: "홈" },
  { href: "/about", label: "소개" },
  { href: "/projects", label: "프로젝트" },
  { href: "/blog", label: "블로그" },
  { href: "/contact", label: "연락하기" },
];
```

Add a mobile button with `aria-expanded`, `aria-controls="primary-navigation"`, and an accessible label. Apply `aria-current="page"` to active links and close the menu when a link is selected. Keep the desktop list visible from `md` upward and ensure every link/button has a visible `focus-visible` ring.

- [ ] **Step 4: Style Markdown without another dependency**

Change `MarkdownRenderer` to use `className="markdown-body"`. Add scoped rules to `app/globals.css` for headings, paragraphs, lists, links, blockquotes, tables, inline code, `pre`, and `.hljs`. The critical overflow rule is:

```css
.markdown-body pre {
  overflow-x: auto;
  border-radius: 0.75rem;
  background: #18181b;
  padding: 1rem;
  color: #f4f4f5;
}

.markdown-body code {
  overflow-wrap: anywhere;
}
```

Do not add Tailwind Typography; the installed Markdown stack plus scoped CSS is sufficient.

- [ ] **Step 5: Verify and commit Task 6**

Run:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Expected: all commands exit 0.

Commit:

```bash
git add tests/navigation.test.ts lib/navigation.ts components/Navigation.tsx components/MarkdownRenderer.tsx app/globals.css
git commit -m "feat: improve blog navigation and readability"
```

## Task 7: Add Firestore rules and operator documentation

**Files:**
- Create: `firestore.rules`
- Create: `.env.example`
- Modify: `README.md`

- [ ] **Step 1: Add the UID-backed rule set**

Create `firestore.rules`:

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null
        && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    match /admins/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow write: if false;
    }

    match /posts/{postId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
  }
}
```

Do not deploy this file blindly. Compare it with the current Firebase Console Production Rules and merge these `admins` and `posts` matches so unrelated collection rules are preserved.

- [ ] **Step 2: Document safe environment names**

Create `.env.example` containing names only:

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

SMTP_HOST=
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=
CONTACT_TO=
CONTACT_FROM=

GITHUB_PROJECTS=
GITHUB_ACCESS_TOKEN=
```

- [ ] **Step 3: Replace stale README sections with actual operation steps**

Document:

1. `npm ci`, `npm run dev`, `npm test`, `npm run lint`, and `npm run build`.
2. Vercel Production/Preview/Development Firebase environment setup.
3. Firebase Authentication Google provider enablement and authorized domains.
4. First Google login, UID lookup in Authentication, and manual `admins/{uid}` document creation.
5. Production Rules backup and merge before deploying `firestore.rules`.
6. `/blog`, `/admin/login`, and `/admin/posts` route purpose.
7. Existing `posts` documents remain compatible; `updatedAt` appears after the first edit.

Remove claims about a missing GitHub Actions workflow, nonexistent LICENSE details, and inaccurate Next.js 15/App Router architecture.

- [ ] **Step 4: Verify and commit Task 7**

Run:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
git diff --check
```

Expected: all commands exit 0.

Commit:

```bash
git add firestore.rules .env.example README.md
git commit -m "docs: add secure blog deployment setup"
```

## Task 8: Final integration verification

**Files:**
- Modify only files required by failures found during this task.

- [ ] **Step 1: Update the code-review graph and inspect blast radius**

Run an incremental graph update for the worktree, then inspect changed flows and verify that public blog, admin, Firebase, navigation, and contact/project flows remain separated.

- [ ] **Step 2: Run the full automated suite**

Run:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
npm audit --omit=dev
git diff --check
```

Expected: tests, lint, type check, build, and diff check exit 0. Record any remaining audit advisory that has no non-breaking fix rather than running `npm audit fix --force`.

- [ ] **Step 3: Run configured-environment smoke checks**

With Vercel Development variables available, verify:

```text
GET /blog -> 200 and existing posts visible
GET /blog/{existing-id} -> 200
GET /board -> redirect to /blog
GET /board/{existing-id} -> redirect to /blog/{existing-id}
GET /admin/login -> 200
```

Then use the single admin Google account to create a temporary post with a custom date, edit its title/date/body, confirm the public detail updates, cancel deletion once, and finally confirm deletion. Do not use a real article for destructive verification.

- [ ] **Step 4: Verify unauthorized behavior**

Sign out and open `/admin/posts/new`; confirm protected content is not rendered. If a non-admin Google account is available, confirm it receives the forbidden state and Firestore rejects direct writes.

- [ ] **Step 5: Commit only evidence-driven corrections**

If verification required code corrections, run the full automated suite again and commit those corrections:

```bash
git add components lib pages tests app/globals.css package.json package-lock.json eslint.config.mjs tsconfig.json README.md firestore.rules .env.example
git commit -m "fix: address blog integration verification"
```

If no corrections were needed, do not create an empty commit.
