import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getAdminAccessState } from "@/lib/admin";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [hasAdminDocument, setHasAdminDocument] = useState(false);
  const [initializationError, setInitializationError] = useState(false);

  useEffect(() => {
    let isActive = true;
    let unsubscribe = () => {};

    queueMicrotask(() => {
      if (!isActive) return;

      try {
        unsubscribe = onAuthStateChanged(
          getFirebaseAuth(),
          async (currentUser) => {
            if (!isActive) return;

            setChecking(true);
            setUser(currentUser);
            setHasAdminDocument(false);
            setInitializationError(false);

            if (!currentUser) {
              setChecking(false);
              return;
            }

            try {
              const adminSnapshot = await getDoc(
                doc(getFirebaseDb(), "admins", currentUser.uid),
              );
              if (isActive) setHasAdminDocument(adminSnapshot.exists());
            } catch (error) {
              console.error("관리자 권한 확인 중 오류 발생:", error);
              if (isActive) setInitializationError(true);
            } finally {
              if (isActive) setChecking(false);
            }
          },
          (error) => {
            console.error("관리자 인증 상태 확인 중 오류 발생:", error);
            if (isActive) {
              setInitializationError(true);
              setChecking(false);
            }
          },
        );
      } catch (error) {
        console.error("관리자 인증 초기화 중 오류 발생:", error);
        setInitializationError(true);
        setChecking(false);
      }
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  if (initializationError) {
    return (
      <p className="rounded-lg bg-red-50 p-6 text-red-700" role="alert">
        관리자 인증을 초기화하지 못했습니다.
      </p>
    );
  }

  const accessState = getAdminAccessState(
    checking,
    Boolean(user),
    hasAdminDocument,
  );

  if (accessState === "checking") {
    return (
      <p className="rounded-lg bg-white p-6 text-gray-600 shadow-sm">
        관리자 권한을 확인하고 있습니다.
      </p>
    );
  }

  if (accessState === "signed-out") {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-gray-700">관리자 로그인이 필요합니다.</p>
        <Link
          href="/admin/login"
          className="mt-4 inline-flex rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white transition hover:bg-gray-700"
        >
          관리자 로그인
        </Link>
      </div>
    );
  }

  if (accessState === "forbidden") {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-red-700" role="alert">
        <p>이 계정에는 관리자 권한이 없습니다.</p>
        <button
          type="button"
          onClick={() => void signOut(getFirebaseAuth())}
          className="mt-4 rounded-lg border border-red-300 px-4 py-2 font-semibold transition hover:bg-red-100"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return children;
}
