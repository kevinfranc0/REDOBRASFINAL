import bcrypt from "bcryptjs";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  conversations,
  favorites,
  listings,
  locations,
  messages,
  notifications,
  orders,
  profiles,
  projects,
  reviews,
  users,
} from "@/db/schema";
import { IDS } from "@/lib/constants";

const globalSeed = globalThis as typeof globalThis & {
  __redobraSeed?: Promise<void>;
};

export function ensureSeeded() {
  if (!globalSeed.__redobraSeed) {
    globalSeed.__redobraSeed = seedInternal().catch((err) => {
      globalSeed.__redobraSeed = undefined;
      throw err;
    });
  }
  return globalSeed.__redobraSeed;
}

async function seedInternal() {
  const [{ n }] = await db.select({ n: count() }).from(users);
  if (n > 0) return;

  const passwordHash = await bcrypt.hash("demo1234", 10);
  const adminHash = await bcrypt.hash("admin1234", 10);
  const now = new Date();

  await db.insert(users).values([
    {
      id: IDS.kevin,
      email: "kevin@redobra.co",
      passwordHash,
      role: "user",
      emailVerified: true,
      isDemo: true,
    },
    {
      id: IDS.daniela,
      email: "daniela@redobra.co",
      passwordHash,
      emailVerified: true,
      isDemo: true,
    },
    {
      id: IDS.jhonatan,
      email: "jhonatan@redobra.co",
      passwordHash,
      emailVerified: true,
      isDemo: true,
    },
    {
      id: IDS.valentina,
      email: "valentina@redobra.co",
      passwordHash,
      emailVerified: true,
      isDemo: true,
    },
    {
      id: IDS.andres,
      email: "andres@redobra.co",
      passwordHash,
      emailVerified: true,
      isDemo: true,
    },
    {
      id: IDS.laura,
      email: "laura@redobra.co",
      passwordHash,
      emailVerified: true,
      isDemo: true,
    },
    {
      id: IDS.taller,
      email: "taller@redobra.co",
      passwordHash,
      emailVerified: true,
      isDemo: true,
    },
    {
      id: IDS.admin,
      email: "admin@redobra.co",
      passwordHash: adminHash,
      role: "admin",
      emailVerified: true,
      isDemo: true,
    },
  ]);

  await db.insert(profiles).values([
    {
      userId: IDS.kevin,
      displayName: "Kevin Alexander",
      firstName: "Kevin",
      handle: "kevin",
      userType: "estudiante",
      roleTitle: "Estudiante de Arquitectura",
      bio: "Estudiante de Arquitectura en Popayán. Me interesa el diseño de vivienda social, el render y el trabajo en equipo.",
      neighborhood: "Centro",
      lat: 2.4418,
      lng: -76.6063,
      avatarUrl: "/images/kevin.jpg",
      coverUrl: "/images/hero-popayan.jpg",
      ratingAvg: 4.8,
      ratingCount: 23,
      jobsCompleted: 12,
      isVerified: true,
      verificationType: "usuario",
      skills: ["AutoCAD", "SketchUp", "Render", "Diseño"],
      portfolioUrls: [
        "/images/render-casa.jpg",
        "/images/listings/casa-noche.jpg",
        "/images/listings/villa.jpg",
        "/images/planos-cad.jpg",
      ],
      isOnline: true,
      isDemo: true,
    },
    {
      userId: IDS.daniela,
      displayName: "Daniela R.",
      firstName: "Daniela",
      handle: "daniela",
      userType: "profesional",
      roleTitle: "Arquitecta · Render y visualización",
      bio: "Arquitecta freelance. Renders de vivienda, comerciales y concursos. Entrega en 48–72 h.",
      neighborhood: "Valencia",
      lat: 2.448,
      lng: -76.598,
      avatarUrl: "/images/avatars/daniela.jpg",
      coverUrl: "/images/render-casa.jpg",
      ratingAvg: 5.0,
      ratingCount: 12,
      jobsCompleted: 18,
      isVerified: true,
      verificationType: "profesional",
      skills: ["V-Ray", "Corona", "3ds Max", "Lumion"],
      portfolioUrls: [
        "/images/render-casa.jpg",
        "/images/listings/casa-noche.jpg",
        "/images/listings/villa.jpg",
      ],
      isOnline: true,
      isDemo: true,
    },
    {
      userId: IDS.jhonatan,
      displayName: "Jhonatan M.",
      firstName: "Jhonatan",
      handle: "jhonatan",
      userType: "estudiante",
      roleTitle: "Estudiante de Ingeniería Civil",
      bio: "Dibujo técnico, AutoCAD y apoyo en proyectos estructurales.",
      neighborhood: "La Esmeralda",
      lat: 2.455,
      lng: -76.61,
      avatarUrl: "/images/avatars/jhonatan.jpg",
      ratingAvg: 4.9,
      ratingCount: 14,
      jobsCompleted: 9,
      isVerified: true,
      verificationType: "usuario",
      skills: ["AutoCAD", "Estructuras", "Planos"],
      isOnline: false,
      isDemo: true,
    },
    {
      userId: IDS.valentina,
      displayName: "Valentina C.",
      firstName: "Valentina",
      handle: "valentina",
      userType: "profesional",
      roleTitle: "Arquitecta",
      bio: "Asesoría académica, proyectos de grado y acompañamiento en concursos.",
      neighborhood: "Modelo",
      lat: 2.438,
      lng: -76.62,
      avatarUrl: "/images/avatars/valentina.jpg",
      coverUrl: "/images/listings/iglesia.jpg",
      ratingAvg: 4.8,
      ratingCount: 6,
      jobsCompleted: 11,
      isVerified: true,
      verificationType: "profesional",
      skills: ["Arquitectura", "Asesoría", "Concursos"],
      isOnline: true,
      isDemo: true,
    },
    {
      userId: IDS.andres,
      displayName: "Andrés P.",
      firstName: "Andrés",
      handle: "andres",
      userType: "tecnico",
      roleTitle: "Tecnólogo en Construcción",
      bio: "Levantamientos, alquiler de herramientas y materiales de obra.",
      neighborhood: "Campamento",
      lat: 2.46,
      lng: -76.6,
      avatarUrl: "/images/avatars/andres.jpg",
      coverUrl: "/images/topografia.jpg",
      ratingAvg: 4.9,
      ratingCount: 8,
      jobsCompleted: 22,
      isVerified: true,
      verificationType: "usuario",
      skills: ["Topografía", "Obra", "Herramientas"],
      isOnline: false,
      isDemo: true,
    },
    {
      userId: IDS.laura,
      displayName: "Laura G.",
      firstName: "Laura",
      handle: "laura",
      userType: "estudiante",
      roleTitle: "Estudiante de Arquitectura",
      bio: "Diseño, maquetas y trabajo colaborativo para talleres universitarios.",
      neighborhood: "Centro",
      lat: 2.443,
      lng: -76.605,
      avatarUrl: "/images/avatars/laura.jpg",
      ratingAvg: 4.7,
      ratingCount: 6,
      jobsCompleted: 4,
      isVerified: false,
      skills: ["Maquetas", "Diseño", "Illustrator"],
      isOnline: true,
      isDemo: true,
    },
    {
      userId: IDS.taller,
      displayName: "Taller 3D Popayán",
      firstName: "Taller",
      handle: "taller3d",
      userType: "empresa",
      roleTitle: "Taller de impresión 3D",
      bio: "Impresión 3D de maquetas, prototipos y piezas. Recogida en el norte de Popayán.",
      neighborhood: "Norte",
      lat: 2.452,
      lng: -76.59,
      avatarUrl: "/images/avatars/taller.jpg",
      coverUrl: "/images/listings/impresora3d.jpg",
      ratingAvg: 4.9,
      ratingCount: 10,
      jobsCompleted: 40,
      isVerified: true,
      verificationType: "empresa",
      skills: ["Impresión 3D", "Maquetas", "Prototipos"],
      isOnline: true,
      isDemo: true,
    },
    {
      userId: IDS.admin,
      displayName: "Equipo REDOBRA",
      firstName: "Admin",
      handle: "admin",
      userType: "empresa",
      roleTitle: "Administración",
      bio: "Equipo de operación de REDOBRA Popayán.",
      avatarUrl: "/images/kevin.jpg",
      isVerified: true,
      verificationType: "empresa",
      isDemo: true,
    },
  ]);

  const catRows = [
    ["arquitectura", "Arquitectura", "servicio", 1],
    ["ingenieria-civil", "Ingeniería civil", "servicio", 2],
    ["autocad", "AutoCAD", "servicio", 3],
    ["revit", "Revit / BIM", "servicio", 4],
    ["modelado-3d", "Modelado 3D", "servicio", 5],
    ["render", "Render", "servicio", 6],
    ["diseno-grafico", "Diseño gráfico", "servicio", 7],
    ["topografia", "Topografía", "servicio", 8],
    ["presupuestos", "Presupuestos", "servicio", 9],
    ["electricas", "Instalaciones eléctricas", "servicio", 10],
    ["maquetas", "Maquetas", "servicio", 11],
    ["impresion-3d", "Impresión 3D", "servicio", 12],
    ["fotografia", "Fotografía", "servicio", 13],
    ["asesorias", "Asesorías", "servicio", 14],
    ["construccion", "Construcción", "servicio", 15],
    ["mantenimiento", "Mantenimiento", "servicio", 16],
    ["madera", "Madera", "material", 1],
    ["cemento", "Cemento", "material", 2],
    ["pintura", "Pintura", "material", 3],
    ["herramientas", "Herramientas", "herramienta", 1],
    ["equipos", "Equipos", "herramienta", 2],
    ["bloques-cad", "Bloques CAD", "recurso", 1],
    ["familias-revit", "Familias Revit", "recurso", 2],
    ["modelos-3d", "Modelos 3D", "recurso", 3],
    ["plantillas-excel", "Plantillas Excel", "recurso", 4],
    ["detalles", "Detalles constructivos", "recurso", 5],
  ] as const;

  const insertedCats = await db
    .insert(categories)
    .values(
      catRows.map(([slug, name, type, sortOrder]) => ({
        slug,
        name,
        type,
        sortOrder,
      })),
    )
    .returning();

  const cat = (slug: string) => insertedCats.find((c) => c.slug === slug)?.id;

  const L = {
    topo: "a1111111-1111-4111-8111-111111111111",
    cad: "a2222222-2222-4222-8222-222222222222",
    render: "a3333333-3333-4333-8333-333333333333",
    asesoria: "a4444444-4444-4444-8444-444444444444",
    renderFeat: "a5555555-5555-4555-8555-555555555555",
    madera: "a6666666-6666-4666-8666-666666666666",
    mezcladora: "a7777777-7777-4777-8777-777777777777",
    cemento: "a8888888-8888-4888-8888-888888888888",
    taladro: "a9999999-9999-4999-8999-999999999999",
    revitFam: "b1111111-1111-4111-8111-111111111111",
    bloques: "b2222222-2222-4222-8222-222222222222",
    excel: "b3333333-3333-4333-8333-333333333333",
    detalles: "b4444444-4444-4444-8444-444444444444",
    impresion: "b5555555-5555-4555-8555-555555555555",
    maqueta: "b6666666-6666-4666-8666-666666666666",
    revitMod: "b7777777-7777-4777-8777-777777777777",
  };

  await db.insert(listings).values([
    {
      id: L.topo,
      authorId: IDS.andres,
      categoryId: cat("topografia"),
      type: "servicio",
      mode: "ofrecer",
      title: "Levantamiento topográfico",
      description:
        "Levantamiento de lotes y predios en Popayán y alrededores. Entrega de planos y archivo DWG. Incluye visita al sitio.",
      price: 150000,
      city: "Popayán",
      neighborhood: "Campamento",
      lat: 2.46,
      lng: -76.6,
      imageUrls: ["/images/topografia.jpg"],
      tags: ["Topografía", "Planos", "DWG"],
      isFeatured: false,
      isDemo: true,
    },
    {
      id: L.cad,
      authorId: IDS.jhonatan,
      categoryId: cat("autocad"),
      type: "servicio",
      mode: "ofrecer",
      title: "Planos en AutoCAD",
      description:
        "Dibujo técnico de plantas, cortes y fachadas. Ideal para entregas universitarias y anteproyectos. Revisiones incluidas.",
      price: 80000,
      imageUrls: ["/images/planos-cad.jpg", "/images/listings/planos.jpg"],
      tags: ["AutoCAD", "Dibujo técnico"],
      neighborhood: "La Esmeralda",
      lat: 2.455,
      lng: -76.61,
      isDemo: true,
    },
    {
      id: L.render,
      authorId: IDS.daniela,
      categoryId: cat("render"),
      type: "servicio",
      mode: "ofrecer",
      title: "Render 3D de proyecto",
      description:
        "Visualización fotorrealista de vivienda o comercio. Hasta 3 vistas por paquete. Iluminación diurna y nocturna.",
      price: 120000,
      imageUrls: ["/images/render-casa.jpg", "/images/listings/casa-noche.jpg"],
      tags: ["Render", "Modelado 3D", "Arquitectura"],
      neighborhood: "Valencia",
      lat: 2.448,
      lng: -76.598,
      isFeatured: true,
      isDemo: true,
    },
    {
      id: L.asesoria,
      authorId: IDS.valentina,
      categoryId: cat("asesorias"),
      type: "servicio",
      mode: "ofrecer",
      title: "Asesoría académica",
      description:
        "Acompañamiento para talleres, anteproyectos y tesis de arquitectura. Sesiones virtuales o presenciales en Popayán.",
      price: 50000,
      imageUrls: ["/images/listings/iglesia.jpg", "/images/hero-popayan.jpg"],
      tags: ["Arquitectura", "Construcción", "Asesoría"],
      neighborhood: "Modelo",
      isDemo: true,
    },
    {
      id: L.renderFeat,
      authorId: IDS.daniela,
      categoryId: cat("render"),
      type: "servicio",
      mode: "ofrecer",
      title: "Render de vivienda moderna",
      description:
        "Paquete de renders exteriores para vivienda unifamiliar. Entrega en 72 horas. Incluye una ronda de cambios.",
      price: 120000,
      imageUrls: ["/images/listings/casa-noche.jpg", "/images/listings/villa.jpg"],
      tags: ["Servicio", "Render", "3D"],
      isFeatured: true,
      isDemo: true,
    },
    {
      id: L.revitMod,
      authorId: IDS.valentina,
      categoryId: cat("revit"),
      type: "servicio",
      mode: "ofrecer",
      title: "Modelado Revit / BIM",
      description:
        "Modelado BIM de vivienda o aula. Familias básicas, plantas y cortes. Pensado para estudiantes y profesionales.",
      price: 180000,
      imageUrls: ["/images/listings/bim.jpg", "/images/listings/modelado.jpg"],
      tags: ["Revit", "BIM", "Modelado"],
      isDemo: true,
    },
    {
      id: L.maqueta,
      authorId: IDS.laura,
      categoryId: cat("maquetas"),
      type: "servicio",
      mode: "ofrecer",
      title: "Maqueta arquitectónica",
      description:
        "Elaboración de maquetas de estudio y presentación. Escalas 1:100 y 1:50. Materiales livianos y acabados limpios.",
      price: 90000,
      imageUrls: ["/images/listings/maqueta.jpg"],
      tags: ["Maquetas", "Arquitectura"],
      isDemo: true,
    },
    {
      id: L.impresion,
      authorId: IDS.taller,
      categoryId: cat("impresion-3d"),
      type: "servicio",
      mode: "ofrecer",
      title: "Taller de impresión 3D",
      description:
        "Impresión de maquetas, volumetrías y prototipos. Filamento PLA. Recogida en norte de Popayán o envío local.",
      price: 35000,
      imageUrls: ["/images/listings/impresora3d.jpg"],
      tags: ["Impresión 3D", "Maquetas"],
      neighborhood: "Norte",
      lat: 2.452,
      lng: -76.59,
      isFeatured: true,
      isDemo: true,
    },
    {
      id: L.madera,
      authorId: IDS.andres,
      categoryId: cat("madera"),
      type: "material",
      mode: "vender",
      title: "Retazos de madera",
      description:
        "Tablones y listones sobrantes de obra. Ideales para maquetas o trabajos menores. Retiro en Campamento.",
      price: 20000,
      condition: "Sobrante",
      imageUrls: ["/images/madera.jpg"],
      tags: ["Madera", "Sobrantes"],
      neighborhood: "Campamento",
      lat: 2.46,
      lng: -76.6,
      isDemo: true,
    },
    {
      id: L.mezcladora,
      authorId: IDS.andres,
      categoryId: cat("equipos"),
      type: "herramienta",
      mode: "alquilar",
      title: "Mezcladora de concreto",
      description:
        "Alquiler por día. Capacidad para obra menor y autoconstrucción. Recogida o entrega en Popayán (costo extra).",
      price: 50000,
      priceLabel: "Alquiler por día",
      condition: "Usado — buen estado",
      imageUrls: ["/images/mezcladora.jpg"],
      tags: ["Equipos", "Obra"],
      isDemo: true,
    },
    {
      id: L.cemento,
      authorId: IDS.andres,
      categoryId: cat("cemento"),
      type: "material",
      mode: "vender",
      title: "Cemento (saco)",
      description:
        "Sacos de cemento para obra menor. Precio por saco. Disponibilidad inmediata.",
      price: 28000,
      condition: "Nuevo",
      imageUrls: ["/images/cemento.jpg"],
      tags: ["Materiales", "Cemento"],
      isDemo: true,
    },
    {
      id: L.taladro,
      authorId: IDS.jhonatan,
      categoryId: cat("herramientas"),
      type: "herramienta",
      mode: "alquilar",
      title: "Taladro percutor",
      description:
        "Taladro percutor para madera, metal y mampostería. Alquiler por día, incluye brocas básicas.",
      price: 35000,
      priceLabel: "Alquiler por día",
      condition: "Usado — excelente",
      imageUrls: ["/images/listings/taladro.jpg"],
      tags: ["Herramientas"],
      isDemo: true,
    },
    {
      id: L.revitFam,
      authorId: IDS.valentina,
      categoryId: cat("familias-revit"),
      type: "recurso",
      mode: "vender",
      title: "Familia de Revit (viviendas)",
      description:
        "Pack de familias paramétricas para vivienda: ventanas, puertas, mobiliario básico. Recurso original de autor.",
      price: 35000,
      imageUrls: ["/images/listings/casa-suburb.jpg", "/images/listings/bim.jpg"],
      tags: ["Revit", "BIM", "Familias"],
      isDemo: true,
    },
    {
      id: L.bloques,
      authorId: IDS.jhonatan,
      categoryId: cat("bloques-cad"),
      type: "recurso",
      mode: "vender",
      title: "Bloques CAD arquitectura",
      description:
        "Biblioteca de bloques DWG: mobiliario, vegetación, personas y vehículos. Para plantas 1:50 y 1:100.",
      price: 20000,
      imageUrls: ["/images/listings/planos.jpg", "/images/planos-cad.jpg"],
      tags: ["AutoCAD", "Bloques", "Dibujo técnico"],
      isDemo: true,
    },
    {
      id: L.excel,
      authorId: IDS.andres,
      categoryId: cat("plantillas-excel"),
      type: "recurso",
      mode: "vender",
      title: "Plantillas de Excel (presupuestos)",
      description:
        "Plantilla de presupuesto de obra con APU, resúmenes y gráficos. Editable y lista para adaptar a tu proyecto.",
      price: 15000,
      imageUrls: ["/images/listings/presupuesto.jpg"],
      tags: ["Excel", "Presupuestos"],
      isDemo: true,
    },
    {
      id: L.detalles,
      authorId: IDS.daniela,
      categoryId: cat("detalles"),
      type: "recurso",
      mode: "vender",
      title: "Detalles constructivos",
      description:
        "Láminas de detalles de cubiertas, muros y carpintería. Archivos DWG + PDF. Material de autor, de uso profesional.",
      price: 25000,
      imageUrls: ["/images/listings/detalles.jpg", "/images/listings/planos.jpg"],
      tags: ["Detalles", "Dibujo técnico"],
      isDemo: true,
    },
  ]);

  const P = {
    vivienda: "c1111111-1111-4111-8111-111111111111",
    concurso: "c2222222-2222-4222-8222-222222222222",
    social: "c3333333-3333-4333-8333-333333333333",
    revit: "c4444444-4444-4444-8444-444444444444",
  };

  await db.insert(projects).values([
    {
      id: P.vivienda,
      authorId: IDS.kevin,
      title: "Busco estudiante de arquitectura",
      description:
        "Para desarrollar proyecto de vivienda. Trabajo en equipo, con buena actitud y compromiso. Reuniones en el centro de Popayán.",
      area: "Arquitectura",
      skills: ["Arquitectura", "Diseño"],
      neededPeople: 2,
      deadline: "2 semanas",
      kind: "busco_equipo",
      isDemo: true,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2),
    },
    {
      id: P.concurso,
      authorId: IDS.laura,
      title: "Equipo para concurso universitario",
      description:
        "Busco estudiantes de ingeniería civil y arquitectura para concurso de diseño estructural. Entrega en 3 semanas.",
      area: "Ingeniería Civil",
      skills: ["Ingeniería Civil", "Arquitectura"],
      neededPeople: 3,
      deadline: "3 semanas",
      kind: "busco_equipo",
      isDemo: true,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 5),
    },
    {
      id: P.social,
      authorId: IDS.valentina,
      title: "Proyecto de vivienda social",
      description:
        "Busco apoyo en modelado 3D y planos para un anteproyecto de vivienda social en el Cauca.",
      area: "Arquitectura",
      skills: ["Modelado 3D", "Planos"],
      budget: 400000,
      neededPeople: 2,
      deadline: "1 mes",
      kind: "busco_equipo",
      isDemo: true,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24),
    },
    {
      id: P.revit,
      authorId: IDS.jhonatan,
      title: "Necesito modelador Revit",
      description:
        "Proyecto académico de aula múltiple. Busco alguien con manejo de Revit para modelar en 10 días.",
      area: "BIM",
      skills: ["Revit", "BIM"],
      budget: 150000,
      neededPeople: 1,
      kind: "busco_equipo",
      isDemo: true,
    },
  ]);

  await db.insert(reviews).values([
    {
      reviewerId: IDS.kevin,
      revieweeId: IDS.daniela,
      listingId: L.render,
      quality: 5,
      punctuality: 5,
      communication: 5,
      value: 5,
      overall: 5,
      comment: "Excelente render, exactamente lo que necesitaba para la entrega.",
    },
    {
      reviewerId: IDS.laura,
      revieweeId: IDS.daniela,
      listingId: L.renderFeat,
      quality: 5,
      punctuality: 5,
      communication: 4,
      value: 5,
      overall: 4.8,
      comment: "Muy profesional y rápida.",
    },
    {
      reviewerId: IDS.kevin,
      revieweeId: IDS.jhonatan,
      listingId: L.cad,
      quality: 5,
      punctuality: 5,
      communication: 5,
      value: 4,
      overall: 4.8,
      comment: "Planos limpios y a tiempo.",
    },
    {
      reviewerId: IDS.valentina,
      revieweeId: IDS.kevin,
      listingId: L.render,
      quality: 5,
      punctuality: 5,
      communication: 4,
      value: 5,
      overall: 4.8,
      comment: "Kevin es responsable y tiene buen criterio de diseño.",
    },
  ]);

  const conv1 = "d1111111-1111-4111-8111-111111111111";
  const conv2 = "d2222222-2222-4222-8222-222222222222";
  const conv3 = "d3333333-3333-4333-8333-333333333333";
  const conv4 = "d4444444-4444-4444-8444-444444444444";
  const conv5 = "d5555555-5555-4555-8555-555555555555";

  await db.insert(conversations).values([
    {
      id: conv1,
      userAId: IDS.kevin,
      userBId: IDS.daniela,
      listingId: L.render,
      lastMessageAt: new Date(now.getTime() - 1000 * 60 * 40),
    },
    {
      id: conv2,
      userAId: IDS.kevin,
      userBId: IDS.jhonatan,
      listingId: L.cad,
      lastMessageAt: new Date(now.getTime() - 1000 * 60 * 60 * 20),
    },
    {
      id: conv3,
      userAId: IDS.kevin,
      userBId: IDS.valentina,
      lastMessageAt: new Date(now.getTime() - 1000 * 60 * 60 * 26),
    },
    {
      id: conv4,
      userAId: IDS.kevin,
      userBId: IDS.taller,
      listingId: L.impresion,
      lastMessageAt: new Date(now.getTime() - 1000 * 60 * 60 * 50),
    },
    {
      id: conv5,
      userAId: IDS.kevin,
      userBId: IDS.andres,
      lastMessageAt: new Date(now.getTime() - 1000 * 60 * 60 * 70),
    },
  ]);

  await db.insert(messages).values([
    {
      conversationId: conv1,
      senderId: IDS.kevin,
      content: "Hola Daniela, ¿sigues tomando renders esta semana?",
      createdAt: new Date(now.getTime() - 1000 * 60 * 80),
    },
    {
      conversationId: conv1,
      senderId: IDS.daniela,
      content: "Hola Kevin, sí. ¿Me puedes enviar el archivo 3D?",
      createdAt: new Date(now.getTime() - 1000 * 60 * 50),
    },
    {
      conversationId: conv1,
      senderId: IDS.daniela,
      content: "Render de vivienda — te confirmo entrega el viernes.",
      createdAt: new Date(now.getTime() - 1000 * 60 * 40),
    },
    {
      conversationId: conv2,
      senderId: IDS.kevin,
      content: "¿Me puedes enviar el archivo?",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 20),
    },
    {
      conversationId: conv3,
      senderId: IDS.valentina,
      content: "Equipo para proyecto — ¿te late el concurso?",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 26),
    },
    {
      conversationId: conv4,
      senderId: IDS.taller,
      content: "¡Perfecto! Te contacto.",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 50),
    },
    {
      conversationId: conv5,
      senderId: IDS.andres,
      content: "Materiales disponibles para retiro mañana.",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 70),
    },
    {
      conversationId: conv1,
      senderId: IDS.laura,
      content: "placeholder skip",
    },
  ]);

  // Remove accidental laura message if inserted on wrong conv - actually I added a bad message.
  await db.delete(messages).where(eq(messages.content, "placeholder skip"));

  await db.insert(messages).values([
    {
      conversationId: conv3,
      senderId: IDS.laura,
      content: "Muchas gracias!",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 90),
    },
  ]);

  // Laura conversation
  const conv6 = "d6666666-6666-4666-8666-666666666666";
  await db.insert(conversations).values({
    id: conv6,
    userAId: IDS.kevin,
    userBId: IDS.laura,
    lastMessageAt: new Date(now.getTime() - 1000 * 60 * 60 * 90),
  });
  await db.insert(messages).values({
    conversationId: conv6,
    senderId: IDS.laura,
    content: "Muchas gracias!",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 90),
  });

  await db.insert(notifications).values([
    {
      userId: IDS.kevin,
      type: "message",
      title: "Daniela R. te escribió",
      body: "Render de vivienda — te confirmo entrega el viernes.",
      href: `/chat/${conv1}`,
    },
    {
      userId: IDS.kevin,
      type: "project",
      title: "Nuevo proyecto cerca de ti",
      body: "Equipo para concurso universitario en Popayán.",
      href: `/proyectos/${P.concurso}`,
    },
    {
      userId: IDS.kevin,
      type: "review",
      title: "Tu perfil recibió una valoración",
      body: "Valentina C. te calificó con 4.8.",
      href: "/perfil",
    },
    {
      userId: IDS.kevin,
      type: "favorite",
      title: "Alguien guardó tu publicación",
      body: "Un usuario guardó un proyecto en el que participas.",
      href: "/favoritos",
    },
    {
      userId: IDS.daniela,
      type: "order",
      title: "Tu servicio recibió una solicitud",
      body: "Kevin Alexander solicitó Render 3D de proyecto.",
      href: "/perfil",
    },
  ]);

  await db.insert(favorites).values([
    {
      userId: IDS.kevin,
      targetType: "listing",
      targetId: L.render,
    },
    {
      userId: IDS.kevin,
      targetType: "listing",
      targetId: L.impresion,
    },
    {
      userId: IDS.kevin,
      targetType: "profile",
      targetId: IDS.daniela,
    },
  ]);

  await db.insert(orders).values([
    {
      buyerId: IDS.kevin,
      sellerId: IDS.daniela,
      listingId: L.render,
      amount: 120000,
      commission: 6000,
      status: "completed",
      completedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4),
    },
    {
      buyerId: IDS.laura,
      sellerId: IDS.taller,
      listingId: L.impresion,
      amount: 35000,
      commission: 1750,
      status: "accepted",
    },
    {
      buyerId: IDS.jhonatan,
      sellerId: IDS.andres,
      listingId: L.mezcladora,
      amount: 50000,
      commission: 0,
      status: "requested",
    },
  ]);

  await db.insert(locations).values([
    {
      name: "Universidad del Cauca",
      kind: "campus",
      lat: 2.4415,
      lng: -76.6062,
    },
    {
      name: "SENA Popayán",
      kind: "campus",
      lat: 2.4532,
      lng: -76.5984,
    },
    {
      name: "Centro histórico",
      kind: "zona",
      lat: 2.4418,
      lng: -76.6063,
    },
    {
      name: "Taller de impresión 3D (DEMO)",
      kind: "servicio",
      lat: 2.452,
      lng: -76.59,
      listingId: L.impresion,
    },
    {
      name: "Materiales Andrés P. (DEMO)",
      kind: "material",
      lat: 2.46,
      lng: -76.6,
      listingId: L.madera,
    },
    {
      name: "Estudio de render (DEMO)",
      kind: "servicio",
      lat: 2.448,
      lng: -76.598,
      listingId: L.render,
    },
  ]);
}

export async function deleteDemoData() {
  await db.delete(users).where(eq(users.isDemo, true));
  globalSeed.__redobraSeed = Promise.resolve();
}
