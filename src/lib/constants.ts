export const BRAND = {
  name: "REDOBRA",
  city: "Popayán",
  tagline: "Conecta, crea, construye.",
  sub: "Todo lo que necesitas para tus proyectos, en un solo lugar.",
};

export const SERVICE_CATEGORIES = [
  { slug: "arquitectura", name: "Arquitectura" },
  { slug: "ingenieria-civil", name: "Ingeniería civil" },
  { slug: "autocad", name: "AutoCAD" },
  { slug: "revit", name: "Revit / BIM" },
  { slug: "modelado-3d", name: "Modelado 3D" },
  { slug: "render", name: "Render" },
  { slug: "diseno-grafico", name: "Diseño gráfico" },
  { slug: "topografia", name: "Topografía" },
  { slug: "presupuestos", name: "Presupuestos" },
  { slug: "electricas", name: "Instalaciones eléctricas" },
  { slug: "maquetas", name: "Maquetas" },
  { slug: "impresion-3d", name: "Impresión 3D" },
  { slug: "fotografia", name: "Fotografía" },
  { slug: "asesorias", name: "Asesorías" },
  { slug: "construccion", name: "Construcción" },
  { slug: "mantenimiento", name: "Mantenimiento" },
] as const;

export const MATERIAL_CATEGORIES = [
  { slug: "madera", name: "Madera" },
  { slug: "cemento", name: "Cemento" },
  { slug: "pintura", name: "Pintura" },
  { slug: "perfiles", name: "Perfiles" },
  { slug: "ladrillos", name: "Ladrillos" },
  { slug: "herramientas", name: "Herramientas" },
  { slug: "equipos", name: "Equipos" },
  { slug: "maquetas-mat", name: "Materiales para maquetas" },
  { slug: "sobrantes", name: "Sobrantes de obra" },
] as const;

export const RESOURCE_CATEGORIES = [
  { slug: "bloques-cad", name: "Bloques CAD" },
  { slug: "familias-revit", name: "Familias Revit" },
  { slug: "modelos-3d", name: "Modelos 3D" },
  { slug: "plantillas-excel", name: "Plantillas Excel" },
  { slug: "plantillas-presupuesto", name: "Plantillas de presupuestos" },
  { slug: "bibliotecas", name: "Bibliotecas" },
  { slug: "texturas", name: "Texturas" },
  { slug: "recursos-grafico", name: "Recursos gráficos" },
  { slug: "detalles", name: "Detalles constructivos" },
  { slug: "plantillas-presentacion", name: "Plantillas de presentación" },
  { slug: "recursos-bim", name: "Recursos BIM" },
] as const;

export const USER_TYPES = [
  {
    id: "estudiante",
    title: "Estudiante",
    text: "Busca servicios, compañeros, ofrece tu talento y arma portafolio.",
  },
  {
    id: "profesional",
    title: "Profesional",
    text: "Ofrece servicios, consigue clientes y publica oportunidades.",
  },
  {
    id: "tecnico",
    title: "Técnico / trabajador",
    text: "Ofrece mano de obra, alquila herramientas y vende sobrantes.",
  },
  {
    id: "empresa",
    title: "Empresa / contratista",
    text: "Busca talento, publica proyectos y contrata servicios.",
  },
] as const;

export const LEGAL_RESOURCES =
  "Los recursos deben ser originales, licenciados o comercializables legalmente. Está prohibido vender trabajos académicos para que otra persona los presente como propios.";

export const DEMO_NOTICE =
  "Contenido DEMO para visualizar el producto. Se puede eliminar desde el panel de administración.";

export const IDS = {
  kevin: "11111111-1111-4111-8111-111111111111",
  daniela: "22222222-2222-4222-8222-222222222222",
  jhonatan: "33333333-3333-4333-8333-333333333333",
  valentina: "44444444-4444-4444-8444-444444444444",
  andres: "55555555-5555-4555-8555-555555555555",
  laura: "66666666-6666-4666-8666-666666666666",
  taller: "77777777-7777-4777-8777-777777777777",
  admin: "88888888-8888-4888-8888-888888888888",
} as const;
