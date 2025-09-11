import { type NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Determine resource type based on file type
    const resourceType = file.type.startsWith("image/") ? "image" : "raw"

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: resourceType,
            folder: "educational-dashboard", // Organize uploads in a folder
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          },
        )
        .end(buffer)
    })

    const uploadResult = result as any

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileName: file.name,
      size: file.size,
      format: uploadResult.format,
    })
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 })
  }
}
