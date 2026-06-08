import { NextResponse } from "next/server"
import { uploadPdfToS3 } from "@/lib/s3"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const slug = (formData.get("slug") as string | null) || ""

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 })
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    const maxMb = Number(process.env.CHAPTER_PDF_MAX_MB || "30")
    if (Number.isFinite(maxMb) && maxMb > 0 && file.size > maxMb * 1024 * 1024) {
      return NextResponse.json({ error: `File must be <= ${maxMb}MB` }, { status: 400 })
    }

    const safeSlug = slug
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    const extension = file.name?.toLowerCase().endsWith(".pdf") ? ".pdf" : ".pdf"
    const randomId =
      typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`

    const key = `chapters/${safeSlug || "chapter"}/${randomId}${extension}`
    const bytes = await file.arrayBuffer()
    const body = Buffer.from(bytes)

    const uploaded = await uploadPdfToS3({
      key,
      body,
      contentType: "application/pdf",
    })

    return NextResponse.json({ url: uploaded.url, key: uploaded.key }, { status: 201 })
  } catch (error) {
    console.error("S3 chapter upload failed:", error)
    return NextResponse.json({ error: "Failed to upload PDF" }, { status: 500 })
  }
}

