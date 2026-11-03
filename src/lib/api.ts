import { NextResponse } from "next/server";

export function ok(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
export function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}
export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}
export function estimateReadTime(content: string) {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220));
}
