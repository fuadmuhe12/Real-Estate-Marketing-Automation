import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  amount: z.enum(["25", "50", "100"]),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const decodedName = decodeURIComponent(name);
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid token package. Choose 25, 50, or 100." },
        { status: 400 }
      );
    }

    const amount = parseInt(parsed.data.amount);

    const agent = await prisma.agent.findUnique({
      where: { name: decodedName },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Simulate payment processing delay
    await new Promise((r) => setTimeout(r, 1500));

    const updated = await prisma.agent.update({
      where: { id: agent.id },
      data: { tokens: { increment: amount } },
    });

    return NextResponse.json({
      name: updated.name,
      tokens: updated.tokens,
      purchased: amount,
    });
  } catch (error) {
    console.error("Recharge error:", error);
    return NextResponse.json(
      { error: "Failed to process recharge" },
      { status: 500 }
    );
  }
}
