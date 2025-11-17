import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { subscribePlan } from "../../subscription/subscribe-plan/route"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      password,
      name,
      username,
      userType,
      age,
      phone,
      institutionName,
      profilePicture,
      institutionLogo
    } = body

    // Validate required fields
    if (!email || !password || !name || !username || !userType || !age) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate institution name for non-students
    if (userType !== "student" && !institutionName) {
      return NextResponse.json(
        { error: "Institution name is required for teachers and organizations" },
        { status: 400 }
      )
    }

    // Check if user already exists by email or username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username"
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Map userType to UserRole enum
    let role: UserRole
    switch (userType) {
      case "student":
        role = UserRole.STUDENT
        break
      case "teacher":
        role = UserRole.TEACHER
        break
      case "other":
        role = UserRole.TEACHER // Organizations are treated as teachers for now
        break
      default:
        role = UserRole.STUDENT
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name,
        role,
        age: parseInt(age),
        phone: phone || null,
        profilePicture: profilePicture || null,
        institutionName: institutionName || null,
        institutionLogo: institutionLogo || null
      }
    })

    await subscribePlan(user?.id, "FREE");
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
        redirectUrl: getRedirectUrl(role)
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}

function getRedirectUrl(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return "/admin"
    case UserRole.TEACHER:
      return "/teacher"
    case UserRole.STUDENT:
      return "/student"
    default:
      return "/dashboard"
  }
}