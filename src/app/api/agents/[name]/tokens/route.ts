import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    const agent = await prisma.agent.findUnique({
      where: { name: decodedName },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: agent.name,
      tokens: agent.tokens,
    });
  } catch (error) {
    console.error("Token fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch token balance" },
      { status: 500 }
    );
  }
}
