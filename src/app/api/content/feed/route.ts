import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contents = await prisma.content.findMany({
      include: { agent: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error("Feed fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 });
  }
}
