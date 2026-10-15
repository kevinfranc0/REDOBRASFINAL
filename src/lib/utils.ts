export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatCOP(value: number | null | undefined) {
  if (value === null || value === undefined) return "A convenir";
  return `$ ${value.toLocaleString("es-CO")}`;
}

export function timeAgo(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Ahora";
  if (min < 60) return `Hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Hace ${h} h`;
  const days = Math.floor(h / 24);
  if (days === 1) return "Ayer";
  if (days < 7) return `Hace ${days} días`;
  return d.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });
}

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatKm(km: number) {
  if (km < 0.1) return "Muy cerca";
  if (km < 1) return `${Math.round(km * 10) / 10} km`;
  return `${km.toFixed(1)} km`;
}

export function firstName(full: string) {
  return full.split(" ")[0] ?? full;
}

export function detectSearchIntent(query: string) {
  const q = query.toLowerCase();
  const hits: string[] = [];
  const map: Record<string, string[]> = {
    render: ["render", "visualizaci", "imagen 3d", "casa", "vivienda"],
    "modelado-3d": ["modelado", "3d", "maqueta digital", "sketchup", "blender"],
    revit: ["revit", "bim", "familia"],
    autocad: ["autocad", "cad", "planos", "dibujo técnico"],
    topografia: ["topograf", "levantamiento", "lote"],
    presupuestos: ["presupuesto", "excel", "apu", "costos"],
    maquetas: ["maqueta"],
    "impresion-3d": ["imprimir", "impresión 3d", "impresion 3d"],
    arquitectura: ["arquitect"],
    "ingenieria-civil": ["civil", "estructur", "ingenier"],
    madera: ["madera", "tablón", "retazo"],
    cemento: ["cemento"],
    herramientas: ["taladro", "mezcladora", "herramient"],
  };
  for (const [slug, words] of Object.entries(map)) {
    if (words.some((w) => q.includes(w))) hits.push(slug);
  }
  const type: "servicio" | "material" | "herramienta" | "recurso" | "proyecto" | null =
    q.includes("proyecto") || q.includes("equipo") || q.includes("busco estudiante")
      ? "proyecto"
      : q.includes("alquil") || q.includes("herramient") || q.includes("mezcladora")
        ? "herramienta"
        : q.includes("madera") || q.includes("cemento") || q.includes("ladrillo")
          ? "material"
          : q.includes("bloque") || q.includes("familia") || q.includes("plantilla")
            ? "recurso"
            : hits.length
              ? "servicio"
              : null;
  return { categories: hits, type, city: q.includes("popay") ? "Popayán" : null };
}

export const POPAYAN = { lat: 2.4418, lng: -76.6063 };

export function starsLabel(n: number) {
  return n.toFixed(1);
}
