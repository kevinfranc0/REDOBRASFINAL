import Link from "next/link";
import { Logo } from "@/components/logo";
import { LEGAL_RESOURCES } from "@/lib/constants";

export const metadata = { title: "Términos" };

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <Link href="/">
        <Logo />
      </Link>
      <h1 className="font-display mt-8 text-3xl font-semibold">Términos y datos</h1>
      <div className="prose mt-6 space-y-4 text-sm leading-relaxed text-ink">
        <p>
          REDOBRA Popayán es una plataforma local para conectar estudiantes,
          profesionales, técnicos y empresas del sector AEC. Las publicaciones
          iniciales son gratuitas.
        </p>
        <p>{LEGAL_RESOURCES}</p>
        <p>
          Los usuarios pueden reportar y bloquear cuentas. El equipo de
          administración puede suspender perfiles y retirar publicaciones.
        </p>
        <p>
          Tratamos correo, perfil y mensajes para operar el servicio. No vendemos
          tus datos. La arquitectura está lista para cumplir requisitos de
          protección de datos al escalar.
        </p>
        <p>
          Monetización prevista: comisión por transacción, destacados, perfiles
          premium, publicidad local y suscripción empresarial.
        </p>
      </div>
    </div>
  );
}
