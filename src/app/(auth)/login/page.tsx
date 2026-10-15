import Link from "next/link";
import { Logo, LogoMark } from "@/components/logo";
import { LoginForm } from "@/components/auth-forms";

export const metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-mist lg:grid lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-popayan.jpg"
          alt="Popayán"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-forest/55" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <Logo variant="light" />
          <p className="font-display mt-6 text-4xl font-semibold">
            Conecta, crea, construye.
          </p>
        </div>
      </div>
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-10">
        <div className="mb-8 text-center lg:hidden">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-forest text-white">
            <LogoMark />
          </div>
          <p className="font-display text-xl tracking-[0.16em] text-forest">REDOBRA</p>
          <p className="text-xs tracking-[0.2em] text-mute">Popayán</p>
        </div>
        <h1 className="font-display text-2xl font-semibold">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-mute">¿Qué necesitas hoy en Popayán?</p>
        <div className="mt-6">
          <LoginForm />
        </div>
        <div className="mt-6 space-y-2">
          <p className="text-center text-xs text-mute">O continuar con</p>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-ghost" type="button" disabled>
              Google
            </button>
            <button className="btn-ghost" type="button" disabled>
              Apple
            </button>
          </div>
          <p className="text-center text-[11px] text-mute">
            Acceso social disponible en la siguiente versión.
          </p>
        </div>
        <p className="mt-6 text-center text-sm">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-semibold text-leaf">
            Crear cuenta
          </Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link href="/recuperar" className="text-mute">
            Recuperar contraseña
          </Link>
        </p>
      </div>
    </div>
  );
}
