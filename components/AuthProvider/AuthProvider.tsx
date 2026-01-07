"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/lib/store/authStore";
import { checkSession } from "@/lib/api/clientApi";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);
  const [checking, setChecking] = useState(true);

  const isPrivateRoute = (p: string) =>
    p.startsWith("/profile") || p.startsWith("/notes");

  const isPublicRoute = (p: string) =>
    p.startsWith("/sign-in") || p.startsWith("/sign-up");

  useEffect(() => {
    let mounted = true;

    async function verify() {
      setChecking(true);
      try {
        const user = await checkSession();
        if (!mounted) return;

        if (user) {
          // Якщо на публічному маршруті - НЕ встановлюємо user
          if (pathname && isPublicRoute(pathname)) {
            clearIsAuthenticated();
            setChecking(false);
            return;
          }

          setUser(user);
        } else {
          // Явно очищаємо store якщо user немає
          clearIsAuthenticated();
          // Редірект на sign-in якщо на приватній сторінці
          if (pathname && isPrivateRoute(pathname)) {
            router.replace("/sign-in");
          }
        }
      } catch {
        // При помилці теж очищаємо
        clearIsAuthenticated();
        if (pathname && isPrivateRoute(pathname)) {
          router.replace("/sign-in");
        }
      } finally {
        if (mounted) setChecking(false);
      }
    }

    verify();
    return () => {
      mounted = false;
    };
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (checking) {
    return (
      <div
        style={{
          minHeight: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span>Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
}
