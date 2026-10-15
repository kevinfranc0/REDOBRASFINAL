import Link from "next/link";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="text-center">
        <Logo />
        <h1 className="font-display mt-6 text-3xl font-semibold">No encontramos eso</h1>
        <p className="mt-2 text-mute">La publicación o la página ya no está disponible.</p>
        <Link href="/inicio" className="btn-primary mt-6 inline-block">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
