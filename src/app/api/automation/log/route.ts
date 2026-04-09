import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.automationLog.findMany({
      include: {
        agent: { select: { name: true } },
        content: { select: { caption: true, audience: true, city: true } },
        lead: { select: { name: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Automation log fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch automation log" },
      { status: 500 }
    );
  }
}
