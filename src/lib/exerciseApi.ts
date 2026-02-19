const API_HOST = "exercisedb.p.rapidapi.com";
const API_BASE = `https://${API_HOST}`;

export type ExerciseDBItem = {
  id?: string;
  name?: string;
  gifUrl?: string;
  target?: string;
  bodyPart?: string;
  equipment?: string;
  secondaryMuscles?: string[];
  instructions?: string[];
  [key: string]: any;
};

function getHeaders() {
  const key = import.meta.env.VITE_RAPIDAPI_KEY as string | undefined;
  if (!key) {
    throw new Error("Missing VITE_RAPIDAPI_KEY in .env");
  }
  return {
    "X-RapidAPI-Key": key,
    "X-RapidAPI-Host": API_HOST,
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: "GET", headers: getHeaders() });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ExerciseDB failed: ${res.status} ${text}`);
  }

  return res.json();
}

// só para teste rápido
export async function fetchOneExercise(): Promise<ExerciseDBItem> {
  const data = await fetchJson<any>(`${API_BASE}/exercises?limit=1`);
  return Array.isArray(data) ? data[0] : data;
}

// procurar por nome (aceita parcial)
// 1) tenta endpoint /name/<q>
// 2) se vier [] (sem erro), faz fallback (lista + filter)
export async function searchExerciseByName(name: string): Promise<ExerciseDBItem[]> {
  const q = name.trim();
  if (!q) return [];

  const encoded = encodeURIComponent(q);

  // 1) tenta endpoint "name"
  try {
    const data = await fetchJson<any>(`${API_BASE}/exercises/name/${encoded}`);
    const arr: ExerciseDBItem[] = Array.isArray(data) ? data : [];

    // ✅ se veio vazio, fazemos fallback também (este é o teu caso)
    if (arr.length > 0) return arr;
  } catch {
    // continua para fallback
  }

  // 2) fallback: lista e filtra por includes
  // Nota: se quiseres mais cobertura, aumenta o limit
  const data2 = await fetchJson<any>(`${API_BASE}/exercises?limit=2000`);
  const all: ExerciseDBItem[] = Array.isArray(data2) ? data2 : [];

  const lower = q.toLowerCase();
  return all.filter((x) => (x?.name || "").toLowerCase().includes(lower));
}