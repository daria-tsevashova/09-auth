"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore, { AuthState } from "@/lib/store/authStore";
import { checkSession } from "@/lib/api/clientApi";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const setUser = useAuthStore((s: AuthState) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s: AuthState) => s.clearIsAuthenticated);
  const logout = useAuthStore((s: AuthState) => s.logout);
  const [checking, setChecking] = useState(true);

  const isPrivateRoute = (p: string) => p.startsWith("/profile") || p.startsWith("/notes");

  useEffect(() => {
    let mounted = true;
    async function verify() {
      setChecking(true);
      try {
        const user = await checkSession();
        if (!mounted) return;
        if (user) {
          setUser(user);
          // Якщо авторизований і на auth-сторінці — відправити на профіль
          if (pathname && (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))) {
            router.replace("/profile");
          }
        } else {
          // Не авторизований
          clearIsAuthenticated();
          if (pathname && isPrivateRoute(pathname)) {
            // Перехід на приватну сторінку — перекриваємо контент і редіректимо
            await logout().catch(() => {});
            router.replace("/sign-in");
          }
        }
      } catch {
        clearIsAuthenticated();
        if (pathname && isPrivateRoute(pathname)) {
          await logout().catch(() => {});
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
    
  }, [pathname]);

  if (checking) {
    return (
      <div style={{ minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span>Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
}