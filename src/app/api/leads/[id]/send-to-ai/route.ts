import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateFollowUp } from "@/lib/ai";

const bodySchema = z.object({
  agentName: z.string().min(1, "Agent name is required"),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { agentName } = parsed.data;

    // Find the lead
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Find or create agent
    let agent = await prisma.agent.findUnique({ where: { name: agentName } });
    if (!agent) {
      agent = await prisma.agent.create({ data: { name: agentName } });
    }

    // Check tokens
    if (agent.tokens < 10) {
      return NextResponse.json(
        { error: "Insufficient tokens. You need at least 10 tokens to send to AI." },
        { status: 403 }
      );
    }

    // Generate follow-up message
    const followUpMessage = await generateFollowUp(lead.name, lead.status, agentName);

    // Hot leads get a follow-up message; others get a call script
    const isHot = lead.status === "hot";
    const logType = isHot ? "follow_up_generated" : "call_triggered";
    const logMessage = isHot
      ? `Generated follow-up message for hot lead: ${lead.name}`
      : `Simulated call with AI script for lead: ${lead.name} (${lead.status})`;

    // Deduct tokens + update lead + log in transaction
    const [updatedAgent] = await prisma.$transaction([
      prisma.agent.update({
        where: { id: agent.id },
        data: { tokens: { decrement: 10 } },
      }),
      prisma.lead.update({
        where: { id: lead.id },
        data: { lastContacted: new Date() },
      }),
      prisma.automationLog.create({
        data: {
          type: logType,
          agentId: agent.id,
          leadId: lead.id,
          message: logMessage,
          metadata: JSON.stringify({ followUpMessage }),
        },
      }),
    ]);

    return NextResponse.json({
      message: followUpMessage,
      logType,
      actionLabel: isHot ? "AI Follow-up Message" : "AI Call Script",
      tokens: updatedAgent.tokens,
    });
  } catch (error) {
    console.error("Send to AI error:", error);
    return NextResponse.json(
      { error: "Failed to process lead" },
      { status: 500 }
    );
  }
}
