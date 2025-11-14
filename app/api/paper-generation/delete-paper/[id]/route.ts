import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id)
    return NextResponse.json(
      { error: "Paper Id not found", status: 422 },
      { status: 422 }
    );
  try {

    const isExisting = await prisma.generatedPaper.findUnique({
      where: { id: params.id },
    });
    if (!isExisting) {
      return NextResponse.json(
        { error: "Paper not found", status: 404 },
        { status: 404 }
      );
    }

    await prisma.generatedPaper.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Paper deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete Paper" },
      { status: 500 }
    );
  }
}
