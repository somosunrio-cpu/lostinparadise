import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

type Lang = "es" | "en";

const translations = {
  es: {
    subtitle: "Rutas en bicicleta por Formentera",
    accessLabel: "Introduce tu código de acceso",
    accessPlaceholder: "Ej: PLAYA01 o ADMIN2025",
    accessButton: "Acceder",
    errorEmpty: "Introduce un código",
    errorInvalid: "Código no válido. Inténtalo de nuevo.",
    copyright: "© 2025 Escape From Paradise · Formentera",

    back: "Volver",
    gpsMap: "Mapa GPS",
    instructions: "Instrucciones",
    start: "Inicio",
    arrival: "Llegada",
    step: "Paso",
    point: "Punto",

    exit: "Salir",
    adminPanel: "Panel de Admin",
    newRoute: "Nueva Ruta",
    savedOk: "✓ Guardado correctamente",
    backToList: "Volver a la lista",
    code: "Código",
    name: "Nombre",
    description: "Descripción",
    distance: "Distancia",
    duration: "Duración",
    difficulty: "Dificultad",
    routePoints: "Puntos de la ruta",
    pointLabel: "Punto",
    saveRoute: "Guardar ruta",
    edit: "Editar",
    easy: "Fácil",
    medium: "Media",
    hard: "Difícil",
    lat: "Lat",
    lng: "Lng",
    instruction: "Instrucción",
  },
  en: {
    subtitle: "Bike routes around Formentera",
    accessLabel: "Enter your access code",
    accessPlaceholder: "E.g.: PLAYA01 or ADMIN2025",
    accessButton: "Enter",
    errorEmpty: "Enter a code",
    errorInvalid: "Invalid code. Try again.",
    copyright: "© 2025 Escape From Paradise · Formentera",

    back: "Back",
    gpsMap: "GPS Map",
    instructions: "Instructions",
    start: "Start",
    arrival: "Finish",
    step: "Step",
    point: "Point",

    exit: "Exit",
    adminPanel: "Admin Panel",
    newRoute: "New Route",
    savedOk: "✓ Saved successfully",
    backToList: "Back to list",
    code: "Code",
    name: "Name",
    description: "Description",
    distance: "Distance",
    duration: "Duration",
    difficulty: "Difficulty",
    routePoints: "Route points",
    pointLabel: "Point",
    saveRoute: "Save route",
    edit: "Edit",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    lat: "Lat",
    lng: "Lng",
    instruction: "Instruction",
  },
} as const;

type TranslationKey = keyof typeof translations.es;

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function detectLang(): Lang {
  const stored = localStorage.getItem("efp-lang");
  if (stored === "en" || stored === "es") return stored;
  const nav = navigator.language?.slice(0, 2);
  return nav === "es" ? "es" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("efp-lang", l);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return translations[lang][key] || key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
