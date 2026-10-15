import Link from "next/link";
import { Logo } from "@/components/logo";
import { RegisterForm } from "@/components/auth-forms";

export const metadata = { title: "Crear cuenta" };

export default function RegisterPage() {
  return (
    <div className="min-h-dvh bg-mist">
      <div className="mx-auto max-w-lg px-6 py-10">
        <Link href="/">
          <Logo />
        </Link>
        <h1 className="font-display mt-8 text-3xl font-semibold">Crea tu perfil</h1>
        <p className="mt-2 text-sm text-mute">
          En menos de un minuto ya puedes buscar, publicar y contactar.
        </p>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="mt-6 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-leaf">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
