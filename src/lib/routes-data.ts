export interface RoutePoint {
  lat: number;
  lng: number;
  instruction?: string;
}

export interface BikeRoute {
  id: string;
  code: string;
  name: string;
  description: string;
  distance: string;
  duration: string;
  difficulty: 'Fácil' | 'Media' | 'Difícil';
  points: RoutePoint[];
}

// SHA-256 hash of the admin passphrase. The plaintext code is NOT stored in the bundle.
// NOTE: Without a backend this is a mitigation, not real security — a determined attacker
// could still brute-force or reverse-engineer. For real protection, enable Lovable Cloud
// and validate via an edge function with a server-side secret.
const ADMIN_CODE_HASH = "ad0ee11b4ee66abb29207fdb6f105cb2b771cc549e7917b239b4cab56c9bfa5d";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const ADMIN_SESSION_KEY = "efp-admin-session";

export const defaultRoutes: BikeRoute[] = [
  {
    id: "1",
    code: "PLAYA01",
    name: "Ruta de las Playas",
    description: "Recorrido por las playas más hermosas de Formentera: Ses Illetes, Llevant y Migjorn.",
    distance: "18 km",
    duration: "1h 30min",
    difficulty: "Fácil",
    points: [
      { lat: 38.7080, lng: 1.4220, instruction: "Salida desde el puerto de La Savina" },
      { lat: 38.7150, lng: 1.4350, instruction: "Continúa por el camino costero hacia el norte" },
      { lat: 38.7320, lng: 1.4450, instruction: "Llegas a Ses Illetes — disfruta de la vista" },
      { lat: 38.7280, lng: 1.4500, instruction: "Gira al este hacia Platja de Llevant" },
      { lat: 38.7100, lng: 1.4600, instruction: "Dirígete al sur hacia Es Pujols" },
      { lat: 38.6950, lng: 1.4700, instruction: "Sigue por la costa hasta Platja de Migjorn" },
      { lat: 38.6800, lng: 1.4500, instruction: "Llegada a Migjorn — fin de la ruta" },
    ],
  },
  {
    id: "2",
    code: "FARO02",
    name: "Ruta de los Faros",
    description: "Conecta los faros de Formentera pasando por paisajes increíbles y acantilados.",
    distance: "25 km",
    duration: "2h 15min",
    difficulty: "Media",
    points: [
      { lat: 38.7080, lng: 1.4220, instruction: "Salida desde La Savina" },
      { lat: 38.6980, lng: 1.4100, instruction: "Toma el camino hacia Sant Francesc" },
      { lat: 38.6880, lng: 1.3950, instruction: "Continúa hacia el oeste por la carretera principal" },
      { lat: 38.6640, lng: 1.3880, instruction: "Desvío hacia Cap de Barbaria" },
      { lat: 38.6400, lng: 1.3850, instruction: "Llegada al Faro de Cap de Barbaria" },
      { lat: 38.6640, lng: 1.3880, instruction: "Regresa al cruce y ve al este" },
      { lat: 38.6620, lng: 1.5200, instruction: "Llegada al Faro de La Mola" },
    ],
  },
  {
    id: "3",
    code: "SALINA03",
    name: "Ruta de las Salinas",
    description: "Un paseo tranquilo por las salinas de Formentera, ideal para observar flamencos.",
    distance: "12 km",
    duration: "50min",
    difficulty: "Fácil",
    points: [
      { lat: 38.7080, lng: 1.4220, instruction: "Salida desde La Savina" },
      { lat: 38.7120, lng: 1.4280, instruction: "Dirígete hacia las Salinas de Formentera" },
      { lat: 38.7180, lng: 1.4320, instruction: "Bordea el estanque principal — busca flamencos" },
      { lat: 38.7250, lng: 1.4380, instruction: "Continúa por el camino de tierra" },
      { lat: 38.7200, lng: 1.4250, instruction: "Regreso a La Savina por el camino costero" },
    ],
  },
];

export function getRouteByCode(code: string): BikeRoute | undefined {
  const routes = getRoutes();
  return routes.find((r) => r.code.toUpperCase() === code.toUpperCase());
}

export async function isAdminCode(code: string): Promise<boolean> {
  if (!code) return false;
  // Try both as-typed and uppercased to match the visual uppercase input
  const trimmed = code.trim();
  const hash = await sha256Hex(trimmed);
  const hashUpper = await sha256Hex(trimmed.toUpperCase());
  // Constant-time-ish comparison
  const check = (h: string) => {
    if (h.length !== ADMIN_CODE_HASH.length) return false;
    let mismatch = 0;
    for (let i = 0; i < h.length; i++) {
      mismatch |= h.charCodeAt(i) ^ ADMIN_CODE_HASH.charCodeAt(i);
    }
    return mismatch === 0;
  };
  return check(hash) || check(hashUpper);
}

export function getRoutes(): BikeRoute[] {
  const stored = localStorage.getItem("efp-routes");
  if (stored) return JSON.parse(stored);
  return defaultRoutes;
}

export function saveRoutes(routes: BikeRoute[]) {
  localStorage.setItem("efp-routes", JSON.stringify(routes));
}
