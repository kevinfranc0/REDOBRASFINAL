import Link from "next/link";
import { Logo } from "@/components/logo";
import { ForgotForm, ResetForm } from "@/components/auth-forms";

export const metadata = { title: "Recuperar contraseña" };

export default async function RecuperarPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <div className="min-h-dvh bg-mist">
      <div className="mx-auto max-w-md px-6 py-10">
        <Link href="/">
          <Logo />
        </Link>
        <h1 className="font-display mt-8 text-2xl font-semibold">
          {token ? "Nueva contraseña" : "Recuperar acceso"}
        </h1>
        <p className="mt-2 text-sm text-mute">
          {token
            ? "Elige una contraseña nueva."
            : "Te generamos un enlace. En producción se envía al correo."}
        </p>
        <div className="mt-6">
          {token ? <ResetForm token={token} /> : <ForgotForm />}
        </div>
        <Link href="/login" className="mt-6 inline-block text-sm text-leaf">
          Volver a iniciar sesión
        </Link>
      </div>
    </div>
  );
}
