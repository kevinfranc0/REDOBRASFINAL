"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LocateFixed, MapPin } from "lucide-react";
import { formatCOP, formatKm } from "@/lib/utils";

export type MapPinData = {
  id: string;
  title: string;
  type: string;
  lat: number;
  lng: number;
  image: string;
  price: number | null;
  rating: number;
  ratingCount: number;
  neighborhood: string;
  href: string;
  km: number;
};

const ORIGIN = { lat: 2.4418, lng: -76.6063 };

function toPct(lat: number, lng: number) {
  const latMin = 2.428;
  const latMax = 2.47;
  const lngMin = -76.63;
  const lngMax = -76.575;
  const y = ((latMax - lat) / (latMax - latMin)) * 100;
  const x = ((lng - lngMin) / (lngMax - lngMin)) * 100;
  return {
    left: `${Math.min(92, Math.max(6, x))}%`,
    top: `${Math.min(90, Math.max(8, y))}%`,
  };
}

export function MapNear({ pins }: { pins: MapPinData[] }) {
  const [active, setActive] = useState<MapPinData | null>(pins[0] ?? null);
  const [ready, setReady] = useState(false);
  const sorted = useMemo(
    () => [...pins].sort((a, b) => a.km - b.km),
    [pins],
  );

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="map-grid relative h-[420px] w-full lg:h-[640px]">
          <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden>
            <path
              d="M20 180 C80 120, 140 220, 220 160 S360 80, 460 140 S620 260, 780 200"
              stroke="#9aa8a1"
              strokeWidth="6"
              fill="none"
            />
            <path
              d="M40 40 V600 M120 20 V620 M210 0 V640 M300 30 V600 M390 10 V630 M480 40 V600 M570 20 V620"
              stroke="#c5d0ca"
              strokeWidth="3"
            />
            <path
              d="M0 90 H800 M0 170 H800 M0 250 H800 M0 330 H800 M0 410 H800"
              stroke="#c5d0ca"
              strokeWidth="3"
            />
          </svg>
          <div
            className="absolute rounded-full bg-leaf/20 ring-4 ring-leaf/30"
            style={{
              ...toPct(ORIGIN.lat, ORIGIN.lng),
              width: 18,
              height: 18,
              transform: "translate(-50%, -50%)",
            }}
          />
          {ready
            ? pins.map((p) => {
                const pos = toPct(p.lat, p.lng);
                const on = active?.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActive(p)}
                    style={{ ...pos, transform: "translate(-50%, -100%)" }}
                    className="absolute"
                    aria-label={p.title}
                  >
                    <MapPin
                      size={on ? 34 : 28}
                      className={on ? "fill-leaf text-forest" : "fill-forest text-forest"}
                    />
                  </button>
                );
              })
            : null}
          <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold shadow-card">
            Popayán, Cauca
          </div>
          <button
            type="button"
            className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-white shadow-float"
            onClick={() => setActive(sorted[0] ?? null)}
            aria-label="Mi ubicación"
          >
            <LocateFixed size={18} className="text-forest" />
          </button>
        </div>
        {active ? (
          <Link href={active.href} className="flex gap-3 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.image}
              alt=""
              className="h-20 w-24 rounded-2xl object-cover"
            />
            <div className="min-w-0">
              <p className="truncate font-semibold">{active.title}</p>
              <p className="text-xs capitalize text-mute">
                {active.type} · A {formatKm(active.km)}
              </p>
              <p className="mt-1 text-sm font-bold text-forest">
                {formatCOP(active.price)}
              </p>
            </div>
          </Link>
        ) : null}
      </div>
      <div className="space-y-3">
        {sorted.slice(0, 8).map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActive(p)}
            className={`flex w-full gap-3 rounded-3xl bg-white p-3 text-left shadow-card ${
              active?.id === p.id ? "ring-2 ring-leaf" : ""
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt="" className="h-16 w-16 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{p.title}</p>
              <p className="text-xs text-mute">
                {p.neighborhood} · {formatKm(p.km)}
              </p>
              <p className="text-sm font-bold text-forest">{formatCOP(p.price)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
