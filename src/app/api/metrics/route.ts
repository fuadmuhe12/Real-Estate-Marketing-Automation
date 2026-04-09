import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [postsGenerated, leadsContacted, agents] = await Promise.all([
      prisma.content.count(),
      prisma.automationLog.count({
        where: {
          type: { in: ["follow_up_generated", "call_triggered"] },
        },
      }),
      prisma.agent.findMany({
        select: {
          name: true,
          tokens: true,
          _count: { select: { contents: true, automationLogs: true } },
        },
      }),
    ]);

    const tokensUsed = agents.reduce((sum, a) => sum + (100 - a.tokens), 0);

    const agentMetrics = agents.map((a) => ({
      name: a.name,
      tokensRemaining: a.tokens,
      tokensUsed: 100 - a.tokens,
      postsGenerated: a._count.contents,
      totalActions: a._count.automationLogs,
    }));

    return NextResponse.json({
      postsGenerated,
      leadsContacted,
      tokensUsed,
      agentMetrics,
    });
  } catch (error) {
    console.error("Metrics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
