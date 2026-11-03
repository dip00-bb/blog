import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { createSession, clearSession, getSessionUserId } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

export async function register(body: any) {
  await connectDB();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8)
    return fail("Enter a valid name and email. Password must be at least 8 characters.", 422);
  if (await User.exists({ email })) return fail("An account with this email already exists.", 409);
  const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
  await createSession(String(user._id));
  return ok({ _id: user._id, name: user.name, email: user.email }, 201);
}
export async function login(body: any) {
  await connectDB();
  const email = String(body.email || "").trim().toLowerCase();
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(String(body.password || ""), user.passwordHash)))
    return fail("Email or password is incorrect.", 401);
  await createSession(String(user._id));
  return ok({ _id: user._id, name: user.name, email: user.email });
}
export async function logout() { await clearSession(); return ok({ message: "Signed out" }); }
export async function currentUser() {
  const id = await getSessionUserId();
  if (!id) return fail("Not signed in", 401);
  await connectDB();
  const user = await User.findById(id).select("name email avatar bio");
  return user ? ok(user) : fail("User not found", 404);
}
