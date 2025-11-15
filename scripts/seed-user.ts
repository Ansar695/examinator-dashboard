// import { prisma } from "../lib/prisma"
// import bcrypt from "bcryptjs"

// async function main() {
//   try {
//     // Check if demo user already exists
//     const existingUser = await prisma.user.findUnique({
//       where: { email: "demo@example.com" }
//     })

//     if (existingUser) {
//       return
//     }

//     // Create demo user
//     const hashedPassword = await bcrypt.hash("admin@123", 12)
    
//     const user = await prisma.user.create({
//       data: {
//         email: "admin@super.com",
//         password: hashedPassword,
//         name: "Admin",
//         role: "ADMIN"
//       }
//     })

//   } catch (error) {
//     console.error("Error creating demo user:", error)
//   } finally {
//     await prisma.$disconnect()
//   }
// }

// main()