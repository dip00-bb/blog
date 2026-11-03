export async function api<T = any>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers }, credentials: "include" });
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result.message || "Something went wrong");
  return result.data as T;
}
