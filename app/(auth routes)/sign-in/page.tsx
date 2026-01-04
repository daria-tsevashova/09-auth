"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import css from "./SignInPage.module.css";
import { login, LoginRequest } from "@/lib/api/clientApi";
import useAuthStore, { AuthState } from "@/lib/store/authStore";

export default function SignInPage(){
  const router = useRouter();
  const setUser = useAuthStore((s: AuthState) => s.setUser);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload: LoginRequest = {
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? ""),
    };

    try {
      const user = await login(payload);
      setUser(user);
      router.push("/profile");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Authentication failed");
    }
  };

  useEffect(() => {
    document.title = "Sign-in | NoteHub";
  }, []);

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" className={css.input} required />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" className={css.input} required />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
}
