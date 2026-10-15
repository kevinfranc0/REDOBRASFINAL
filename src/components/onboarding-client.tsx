"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const slides = [
  {
    title: "Encuentra lo que necesitas.",
    text: "Servicios, materiales y herramientas cerca de ti en Popayán.",
    image: "/images/topografia.jpg",
  },
  {
    title: "Comparte tu talento.",
    text: "Ofrece tus conocimientos y consigue oportunidades reales.",
    image: "/images/banner-talento.jpg",
  },
  {
    title: "Construyamos juntos.",
    text: "Conecta con estudiantes, profesionales y empresas de la ciudad.",
    image: "/images/hero-popayan.jpg",
  },
];

export function OnboardingClient() {
  const [i, setI] = useState(0);
  const router = useRouter();
  const s = slides[i];

  function finish() {
    try {
      localStorage.setItem("redobra_onboarded", "1");
    } catch {
      /* ignore */
    }
    router.push("/inicio");
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-white">
      <div className="relative h-[52vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <p className="absolute left-5 top-5 font-display text-xs tracking-[0.2em] text-white">
          REDOBRA · POPAYÁN
        </p>
      </div>
      <div className="flex flex-1 flex-col px-6 pb-8 pt-6">
        <div className="flex gap-1.5">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 flex-1 rounded-full ${idx === i ? "bg-leaf" : "bg-line"}`}
            />
          ))}
        </div>
        <h1 className="font-display mt-6 text-3xl font-semibold leading-tight">{s.title}</h1>
        <p className="mt-3 text-mute">{s.text}</p>
        <div className="mt-auto flex gap-2 pt-8">
          {i < slides.length - 1 ? (
            <>
              <button className="btn-ghost flex-1" onClick={finish}>
                Saltar
              </button>
              <button className="btn-primary flex-1" onClick={() => setI(i + 1)}>
                Siguiente
              </button>
            </>
          ) : (
            <button className="btn-primary w-full py-3.5" onClick={finish}>
              Comenzar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
