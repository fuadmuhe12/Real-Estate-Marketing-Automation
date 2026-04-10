import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      select: { name: true, tokens: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(agents);
  } catch (error) {
    console.error("Agents fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}
