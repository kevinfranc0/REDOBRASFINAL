import Link from "next/link";
import { verifyEmailAction } from "@/app/actions";
import { Logo } from "@/components/logo";

export const metadata = { title: "Verificar correo" };

export default async function VerificarPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  let ok = false;
  if (token) {
    const res = await verifyEmailAction(token);
    ok = !("error" in res);
  }
  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <Logo />
      <h1 className="font-display mt-8 text-2xl font-semibold">
        {ok ? "Correo verificado" : "Verificación"}
      </h1>
      <p className="mt-2 text-sm text-mute">
        {ok
          ? "Tu cuenta ya está verificada."
          : token
            ? "El enlace no es válido o ya se usó."
            : "Revisa tu correo para el enlace de verificación. En DEMO, las cuentas de prueba ya están verificadas."}
      </p>
      <Link href="/inicio" className="btn-primary mt-6 inline-block">
        Ir al inicio
      </Link>
    </div>
  );
}
