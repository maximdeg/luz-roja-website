"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabase } from "../supabase-browser";
import "../admin.css";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const supabase = createBrowserSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("No pudimos iniciar sesión. Revisá el email y la contraseña.");
      setPending(false);
      return;
    }

    // Cookies are set; let the server re-read the session on the next render.
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <main className="lr-admin-login">
      <form className="lr-admin-login-card" onSubmit={onSubmit}>
        <p className="lr-admin-kicker">LUZ ROJA</p>
        <h1>Panel de administración</h1>
        <p className="lr-admin-login-sub">Ingresá con tu cuenta de fundador.</p>

        {error ? <p className="lr-admin-alert">{error}</p> : null}

        <label className="lr-admin-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="lr-admin-field">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button type="submit" className="lr-admin-primary" disabled={pending}>
          {pending ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
