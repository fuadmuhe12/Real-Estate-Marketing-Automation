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

const captions: Record<string, string[]> = {
  buyer: [
    "Your dream home is waiting in {city}! Let me guide you through the best neighborhoods and hidden gems this market has to offer. Ready to find your perfect match?",
    "Thinking about buying in {city}? The market is full of incredible opportunities right now. Let's make your homeownership dreams a reality!",
    "First-time buyer or seasoned investor, {city} has something special for everyone. Drop a comment or DM me to start your journey today!",
  ],
  seller: [
    "Thinking of selling in {city}? Now is the perfect time! With current market trends, your property could be worth more than you think. Let's chat about your options.",
    "Ready to make your next move? {city} sellers are seeing incredible returns this season. Let me show you what your home is really worth!",
    "Your {city} home deserves the spotlight it needs to sell fast and for top dollar. Professional marketing, expert negotiation, and results you can count on.",
  ],
  investor: [
    "Smart investors know: {city} is where the returns are. Whether you're looking for rental properties or fix-and-flips, I've got the inside track on the best deals.",
    "Looking to grow your real estate portfolio in {city}? Let me share the market data and off-market opportunities that my investor clients love.",
    "ROI-focused opportunities in {city} are moving fast. From multi-family to commercial spaces, let's build your wealth through strategic real estate investing.",
  ],
};

const imagePrompts: Record<string, string[]> = {
  buyer: [
    "Modern luxury home exterior at golden hour in {city}, warm lighting, welcoming front porch, manicured lawn, professional real estate photography",
    "Happy family walking through a beautiful open-concept living room, natural light streaming through large windows, {city} skyline visible, warm and inviting atmosphere",
  ],
  seller: [
    "Stunning aerial drone shot of a beautifully staged home in {city}, SOLD sign in front yard, celebration confetti, bright sunny day, professional real estate marketing",
    "Elegant home interior staging with modern furniture, fresh flowers, {city} neighborhood visible through windows, warm natural lighting, magazine quality",
  ],
  investor: [
    "Modern apartment complex in {city} at twilight, well-lit balconies, urban setting, investment property showcase, professional architectural photography",
    "Split image showing before and after renovation of a {city} property, dramatic transformation, clean modern design, real estate investment success story",
  ],
};

const tones = ["luxury", "friendly", "bold", "professional", "modern", "warm"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function generateMock(input: ContentInput): Promise<ContentOutput> {
  await new Promise((r) => setTimeout(r, 500));

  const audienceCaptions = captions[input.audience] || captions.buyer;
  const audiencePrompts = imagePrompts[input.audience] || imagePrompts.buyer;

  return {
    caption: pick(audienceCaptions).replace(/{city}/g, input.city),
    imagePrompt: pick(audiencePrompts).replace(/{city}/g, input.city),
    brandTone: pick(tones),
  };
}

export async function followUpMock(
  leadName: string,
  leadStatus: string,
  agentName: string
): Promise<string> {
  await new Promise((r) => setTimeout(r, 500));

  const messages: Record<string, string[]> = {
    hot: [
      `Hi ${leadName}, this is ${agentName}! I noticed you've been actively searching for properties. I have some exclusive listings that just hit the market that I think you'd love. When would be a good time to chat?`,
      `${leadName}, great news! A property matching your criteria just became available. Based on our last conversation, I think this could be the one. Can we schedule a viewing this week?`,
    ],
    new: [
      `Welcome ${leadName}! I'm ${agentName}, and I'd love to help you on your real estate journey. Whether you're buying, selling, or investing, I'm here to make the process smooth and stress-free. What are you looking for?`,
      `Hi ${leadName}! Thanks for your interest. I'm ${agentName}, and I specialize in helping people find their perfect property. Let me know what your dream home looks like!`,
    ],
    cold: [
      `Hi ${leadName}, it's ${agentName}! It's been a while since we last connected. The market has changed a lot, and I wanted to share some updates that might interest you. Would you like a quick market update?`,
      `${leadName}, hope you're doing well! I'm ${agentName}, just checking in. If your real estate plans have evolved, I'd love to hear about it. No pressure, just here to help when you're ready!`,
    ],
  };

  const statusMessages = messages[leadStatus] || messages.new;
  return pick(statusMessages);
}
