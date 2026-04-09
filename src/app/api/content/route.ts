import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateContent } from "@/lib/ai";

const bodySchema = z.object({
  agentName: z.string().min(1, "Agent name is required"),
  audience: z.enum(["buyer", "seller", "investor"]),
  city: z.string().min(1, "City is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { agentName, audience, city } = parsed.data;

    // Find or create agent
    let agent = await prisma.agent.findUnique({ where: { name: agentName } });
    if (!agent) {
      agent = await prisma.agent.create({ data: { name: agentName } });
    }

    // Check tokens
    if (agent.tokens < 5) {
      return NextResponse.json(
        { error: "Insufficient tokens. You need at least 5 tokens to generate content." },
        { status: 403 }
      );
    }

    // Generate content via AI
    const aiResult = await generateContent({ agentName, audience, city });

    // Store content + deduct tokens + log automation in a transaction
    const [content, updatedAgent, log] = await prisma.$transaction([
      prisma.content.create({
        data: {
          agentId: agent.id,
          audience,
          city,
          caption: aiResult.caption,
          imagePrompt: aiResult.imagePrompt,
          brandTone: aiResult.brandTone,
        },
      }),
      prisma.agent.update({
        where: { id: agent.id },
        data: { tokens: { decrement: 5 } },
      }),
      prisma.automationLog.create({
        data: {
          type: "post_simulated",
          agentId: agent.id,
          message: `Simulated social media post for ${audience}s in ${city}`,
          metadata: JSON.stringify({ audience, city, brandTone: aiResult.brandTone }),
        },
      }),
    ]);

    // Link the automation log to the content
    await prisma.automationLog.update({
      where: { id: log.id },
      data: { contentId: content.id },
    });

    return NextResponse.json({
      content,
      tokens: updatedAgent.tokens,
    });
  } catch (error) {
    console.error("Content generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
