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

    // Determine automation type based on lead status
    const logType = lead.status === "hot" ? "follow_up_generated" : "call_triggered";
    const logMessage =
      lead.status === "hot"
        ? `Generated follow-up message for hot lead: ${lead.name}`
        : `Simulated call trigger for lead: ${lead.name}`;

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
