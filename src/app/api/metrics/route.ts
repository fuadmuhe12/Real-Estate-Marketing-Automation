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
          _count: {
            select: {
              contents: true,
              automationLogs: true,
            },
          },
          automationLogs: {
            select: { type: true },
          },
        },
      }),
    ]);

    // Compute tokens spent from actual actions, not from balance
    // (balance can increase via recharge, so 100 - balance is wrong)
    function computeSpent(logs: { type: string }[]) {
      let spent = 0;
      for (const log of logs) {
        if (log.type === "post_simulated") spent += 5;
        else if (log.type === "follow_up_generated" || log.type === "call_triggered") spent += 10;
      }
      return spent;
    }

    const agentMetrics = agents.map((a) => {
      const spent = computeSpent(a.automationLogs);
      return {
        name: a.name,
        tokensRemaining: a.tokens,
        tokensSpent: spent,
        postsGenerated: a._count.contents,
        totalActions: a._count.automationLogs,
      };
    });

    const tokensUsed = agentMetrics.reduce((sum: number, a: { tokensSpent: number }) => sum + a.tokensSpent, 0);

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
