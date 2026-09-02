import { useState } from "react";

import "./Verification.css";

export default function Verification({ onVerified }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    setError("");
    const cleanUsername = username.trim();

    if (!cleanUsername || !password) {
      setError("Ingresa tu usuario y contraseña.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/admin-auth?action=login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cleanUsername,
          password,
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        setError(
          data?.error || "Usuario o contraseña incorrectos."
        );
        return;
      }

      if (data?.authenticated === true) {
        setUsername("");
        setPassword("");
        setError("");
        onVerified();
        return;
      }

      setError("No fue posible verificar el acceso.");
    } catch (requestError) {
      console.error(
        "Error verificando el acceso privado:",
        requestError
      );
      setError(
        "No se pudo conectar con el servidor de verificación."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="verification-screen">
      <section className="verification-card">
        <div className="verification-logo" aria-label="Netflix">
          <span>Netflix</span>
        </div>

        <div className="verification-heading">
          <h1>Carátula Netflix</h1>
          <p>Acceso privado</p>
        </div>

        <form className="verification-form" onSubmit={handleSubmit}>
          <label
            className="verification-label"
            htmlFor="verification-username"
          >
            Usuario
          </label>

          <input
            id="verification-username"
            className="verification-input"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            disabled={loading}
            placeholder="Ingresa tu usuario"
          />

          <label
            className="verification-label"
            htmlFor="verification-password"
          >
            Contraseña
          </label>

          <input
            id="verification-password"
            className="verification-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            disabled={loading}
            placeholder="Ingresa tu contraseña"
          />

          {error && (
            <div className="verification-error" role="alert">
              {error}
            </div>
          )}

          <button
            className="verification-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "VERIFICANDO..." : "INICIAR SESIÓN"}
          </button>
        </form>
      </section>
    </main>
  );
}

export function VerificationLoading() {
  return (
    <main className="verification-loading-screen">
      <div className="verification-loading-card">
        <div className="verification-loading-spinner" />
        <p>Comprobando acceso...</p>
      </div>
    </main>
  );
}
