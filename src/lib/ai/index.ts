import { generateWithGroq, followUpWithGroq } from "./groq";
import { generateMock, followUpMock } from "./mock";

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

export async function generateContent(input: ContentInput): Promise<ContentOutput> {
  if (process.env.GROQ_API_KEY) {
    return generateWithGroq(input);
  }
  return generateMock(input);
}

export async function generateFollowUp(
  leadName: string,
  leadStatus: string,
  agentName: string
): Promise<string> {
  if (process.env.GROQ_API_KEY) {
    return followUpWithGroq(leadName, leadStatus, agentName);
  }
  return followUpMock(leadName, leadStatus, agentName);
}
