import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Qwen models include <think>...</think> reasoning blocks — strip them
function stripThinkingTags(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

interface ContentInput {
  agentName: string;
  audience: string;
  city: string;
}

interface ContentOutput {
  caption: string;
  imagePrompt: string;
  brandTone: string;
}

export async function generateWithGroq(input: ContentInput): Promise<ContentOutput> {
  const completion = await client.chat.completions.create({
    model: "qwen/qwen3-32b",
    messages: [
      {
        role: "system",
        content: `You are a real estate marketing expert. Generate social media content for real estate agents. Always respond with valid JSON only, no markdown or extra text. The JSON must have exactly these fields:
- "caption": A compelling social media caption (2-3 sentences)
- "imagePrompt": A detailed image generation prompt for the post visual
- "brandTone": One of: "luxury", "friendly", "bold", "professional", "modern", "warm"`,
      },
      {
        role: "user",
        content: `Generate a social media post for agent "${input.agentName}" targeting ${input.audience}s in ${input.city}. Return JSON only.`,
      },
    ],
    temperature: 0.7,
    max_completion_tokens: 1024,
  });

  const rawText = completion.choices[0]?.message?.content || "";
  const text = stripThinkingTags(rawText);

  // Extract JSON from the response (handle potential markdown wrapping)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response as JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return {
    caption: parsed.caption,
    imagePrompt: parsed.imagePrompt || parsed.image_prompt,
    brandTone: parsed.brandTone || parsed.brand_tone,
  };
}

export async function followUpWithGroq(
  leadName: string,
  leadStatus: string,
  agentName: string
): Promise<string> {
  const completion = await client.chat.completions.create({
    model: "qwen/qwen3-32b",
    messages: [
      {
        role: "system",
        content:
          "You are a real estate agent's AI assistant. Generate personalized follow-up messages for leads. Keep messages professional, warm, and action-oriented. 2-3 sentences max. Return only the message text, no JSON.",
      },
      {
        role: "user",
        content: `Write a follow-up message from agent "${agentName}" to lead "${leadName}" (status: ${leadStatus}). The message should encourage them to take the next step in their real estate journey.`,
      },
    ],
    temperature: 0.7,
    max_completion_tokens: 256,
  });

  const raw = completion.choices[0]?.message?.content?.trim() || "";
  const cleaned = stripThinkingTags(raw);
  return cleaned || "Follow-up message could not be generated.";
}
