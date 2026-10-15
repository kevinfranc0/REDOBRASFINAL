"use client";

import { useState } from "react";
import Link from "next/link";
import {
  forgotAction,
  loginAction,
  registerAction,
  resetPasswordAction,
} from "@/app/actions";
import { USER_TYPES } from "@/lib/constants";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-3"
      action={async (fd) => {
        setPending(true);
        setError(null);
        const res = await loginAction(fd);
        if (res && "error" in res) {
          setError(res.error);
          setPending(false);
        }
      }}
    >
      <input
        name="email"
        type="email"
        required
        placeholder="Correo"
        className="input"
        defaultValue="kevin@redobra.co"
      />
      <input
        name="password"
        type="password"
        required
        placeholder="Contraseña"
        className="input"
        defaultValue="demo1234"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="btn-primary w-full py-3.5" disabled={pending}>
        {pending ? "Entrando..." : "Iniciar sesión"}
      </button>
      <p className="text-center text-xs text-mute">
        Demo: kevin@redobra.co / demo1234 · admin@redobra.co / admin1234
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState("estudiante");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-3"
      action={async (fd) => {
        setPending(true);
        setError(null);
        fd.set("userType", type);
        const res = await registerAction(fd);
        if (res && "error" in res) {
          setError(res.error);
          setPending(false);
        }
      }}
    >
      <input name="displayName" required placeholder="Nombre completo" className="input" />
      <input name="email" type="email" required placeholder="Correo" className="input" />
      <input
        name="password"
        type="password"
        required
        minLength={6}
        placeholder="Contraseña"
        className="input"
      />
      <input
        name="roleTitle"
        placeholder="Ej: Estudiante de Arquitectura"
        className="input"
      />
      <div className="grid grid-cols-2 gap-2">
        {USER_TYPES.map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => setType(t.id)}
            className={`rounded-2xl border p-3 text-left text-xs ${
              type === t.id
                ? "border-leaf bg-mint text-forest"
                : "border-line bg-white"
            }`}
          >
            <p className="font-semibold">{t.title}</p>
            <p className="mt-1 text-mute">{t.text}</p>
          </button>
        ))}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="btn-primary w-full py-3.5" disabled={pending}>
        {pending ? "Creando cuenta..." : "Crear cuenta"}
      </button>
      <p className="text-center text-[11px] text-mute">
        Al continuar aceptas los{" "}
        <Link href="/legal/terminos" className="underline">
          términos
        </Link>{" "}
        y el tratamiento de datos.
      </p>
    </form>
  );
}

export function ForgotForm() {
  const [msg, setMsg] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      action={async (fd) => {
        const res = await forgotAction(fd);
        setMsg(res.message);
        if ("demoLink" in res && res.demoLink) setLink(res.demoLink);
      }}
    >
      <input name="email" type="email" required placeholder="Correo" className="input" />
      <button className="btn-primary w-full py-3.5">Enviar enlace</button>
      {msg ? <p className="text-sm text-forest">{msg}</p> : null}
      {link ? (
        <p className="text-sm">
          Enlace DEMO:{" "}
          <Link href={link} className="font-semibold text-leaf underline">
            restablecer contraseña
          </Link>
        </p>
      ) : null}
    </form>
  );
}

export function ResetForm({ token }: { token: string }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      action={async (fd) => {
        fd.set("token", token);
        const res = await resetPasswordAction(fd);
        if ("error" in res) setError(res.error);
        else if ("message" in res) {
          setError(null);
          setMsg(res.message);
        }
      }}
    >
      <input
        name="password"
        type="password"
        required
        minLength={6}
        placeholder="Nueva contraseña"
        className="input"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {msg ? <p className="text-sm text-forest">{msg}</p> : null}
      <button className="btn-primary w-full py-3.5">Actualizar</button>
    </form>
  );
}
