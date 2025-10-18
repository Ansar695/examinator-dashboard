import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

/**
 * ✅ Get the authenticated user's session (or handle unauthorized automatically)
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized", message: "Please login first" },
        { status: 401 }
      ),
    };
  }

  return {
    ok: true,
    session,
    userId: session.user.id,
  };
}

/**
 * ✅ Get session without throwing (for optional auth routes)
 */
export async function getAuthSession() {
  return await getServerSession(authOptions);
}
