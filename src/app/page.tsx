import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Boxes,
  FolderKanban,
  GraduationCap,
  Handshake,
  Recycle,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/logo";
import { getCurrentUser } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  await ensureSeeded();
  const user = await getCurrentUser();

  return (
    <div className="bg-white text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-semibold text-mute md:flex">
          <a href="#como">Cómo funciona</a>
          <a href="#valor">Propuesta</a>
          <Link href="/explorar">Explorar</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Link href="/inicio" className="btn-primary">
              Ir a la app
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm font-semibold sm:block">
                Iniciar sesión
              </Link>
              <Link href="/registro" className="btn-primary">
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-popayan.jpg"
            alt="Centro histórico de Popayán"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/95 via-forest/88 to-forest/40" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <div className="text-white">
            <p className="text-sm tracking-[0.25em] text-white/70">POPAYÁN · CAUCA</p>
            <h1 className="font-display mt-4 text-4xl font-semibold leading-[1.05] sm:text-6xl">
              Conecta, crea, construye.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              La plataforma que une a estudiantes, profesionales y emprendedores
              del sector de la arquitectura, ingeniería y construcción en Popayán.
              Encuentra servicios, materiales, herramientas, proyectos y mucho más.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/registro" className="btn-primary bg-leaf px-6 py-3.5">
                Comenzar
              </Link>
              <Link
                href="/explorar"
                className="rounded-full border border-white/30 px-6 py-3.5 text-sm font-bold"
              >
                Ver oportunidades
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/80">
              {[
                [Briefcase, "Servicios"],
                [Boxes, "Materiales"],
                [FolderKanban, "Proyectos"],
                [GraduationCap, "Recursos"],
                [Users, "Comunidad"],
              ].map(([Icon, label]) => (
                <span key={String(label)} className="flex items-center gap-2">
                  <Icon size={16} />
                  {label as string}
                </span>
              ))}
            </div>
            <p className="mt-10 font-display text-2xl italic text-white/90">
              Popayán construye juntos
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="overflow-hidden rounded-[2.2rem] border-[6px] border-white/20 bg-white shadow-float">
              <div className="relative h-64">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-popayan.jpg"
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-8 bottom-[-42px] rounded-3xl bg-white p-5 text-center shadow-float">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-forest text-white">
                    <LogoMark className="h-7 w-7" />
                  </div>
                  <p className="mt-2 font-display text-lg font-semibold tracking-[0.14em] text-forest">
                    REDOBRA
                  </p>
                  <p className="text-xs tracking-[0.2em] text-mute">Popayán</p>
                  <p className="mt-2 text-sm text-mute">Conecta, crea, construye.</p>
                </div>
              </div>
              <div className="space-y-2 px-5 pb-6 pt-16">
                <Link href="/login" className="btn-primary block text-center">
                  Iniciar sesión
                </Link>
                <Link href="/registro" className="btn-ghost block text-center">
                  Crear cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="valor" className="mx-auto max-w-6xl px-5 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf">
          Propuesta de valor
        </p>
        <h2 className="font-display mt-2 max-w-2xl text-3xl font-semibold sm:text-4xl">
          Todo lo que necesitas para tus proyectos, en un solo lugar.
        </h2>
        <p className="mt-4 max-w-2xl text-mute">
          REDOBRA ordena lo que hoy está fragmentado en WhatsApp, Facebook, grupos
          universitarios y contactos personales. Un punto de encuentro digital
          para el ecosistema académico y profesional de Popayán.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [Sparkles, "Ahorra tiempo y dinero"],
            [Handshake, "Apoya el talento local"],
            [Recycle, "Da una segunda vida a los materiales"],
            [Users, "Genera nuevas oportunidades"],
          ].map(([Icon, t]) => (
            <div key={String(t)} className="rounded-3xl bg-forest p-6 text-white">
              <Icon size={22} />
              <p className="mt-4 font-semibold">{t as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-mist py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-2">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/banner-talento.jpg"
              alt="Talento local en obra"
              className="h-80 w-full rounded-3xl object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="font-display text-3xl font-semibold">
              Tu talento también construye la ciudad.
            </h2>
            <p className="mt-4 text-mute">
              Ofrece tus servicios, comparte tus recursos y encuentra lo que
              necesitas en Popayán. Desde un render hasta una mezcladora, desde un
              compañero de concurso hasta un bloque de CAD.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {[
                "Necesito un render de una vivienda.",
                "Busco estudiante de ingeniería civil para un proyecto.",
                "Alquilo mezcladora de concreto por un día.",
                "Ofrezco modelado en Revit.",
              ].map((t) => (
                <li key={t} className="rounded-2xl bg-white px-4 py-3 shadow-card">
                  “{t}”
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="como" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl font-semibold">En pocos pasos</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            ["01", "Regístrate", "Elige si eres estudiante, profesional, técnico o empresa."],
            ["02", "Busca o publica", "Encuentra un render, un material o un equipo de trabajo."],
            ["03", "Conversen", "Chat interno antes de contratar. Sin perder el hilo."],
            ["04", "Califiquen", "Construyan reputación local, trabajo a trabajo."],
          ].map(([n, t, d]) => (
            <div key={n} className="rounded-3xl border border-line p-5">
              <p className="font-display text-2xl text-leaf">{n}</p>
              <p className="mt-2 font-semibold">{t}</p>
              <p className="mt-1 text-sm text-mute">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="overflow-hidden rounded-[2rem] bg-forest text-white">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <Logo variant="light" />
              <h2 className="font-display mt-8 text-3xl font-semibold">
                La ciudad también se construye con tus ideas.
              </h2>
              <p className="mt-3 text-white/75">Popayán</p>
              <Link
                href="/registro"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-forest"
              >
                Crear cuenta <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative min-h-64">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/listings/iglesia.jpg"
                alt="Arquitectura colonial"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-8 text-center text-sm text-mute">
        <p>REDOBRA Popayán · Conecta, crea, construye.</p>
        <p className="mt-1">
          Hecho para el ecosistema AEC de Popayán, Cauca ·{" "}
          <Link href="/legal/terminos" className="underline">
            Términos
          </Link>
        </p>
        <p className="mt-2 flex items-center justify-center gap-2 text-xs">
          <Wrench size={12} /> Preparado para crecer a otras ciudades de Colombia
        </p>
      </footer>
    </div>
  );
}
