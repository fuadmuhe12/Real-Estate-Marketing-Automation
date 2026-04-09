import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = status ? { status } : {};

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { lastContacted: "desc" },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Leads fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
