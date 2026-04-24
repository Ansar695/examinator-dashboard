import { getServerSession } from "next-auth/next"
import { authOptions } from "../[...nextauth]/route"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ user: null, expires: "" })
  }
  
  return NextResponse.json(session)
}