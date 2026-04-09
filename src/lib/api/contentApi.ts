import { baseApi } from "./baseApi";

interface GenerateContentRequest {
  agentName: string;
  audience: "buyer" | "seller" | "investor";
  city: string;
}

interface ContentItem {
  id: string;
  agentId: string;
  audience: string;
  city: string;
  caption: string;
  imagePrompt: string;
  brandTone: string;
  createdAt: string;
  agent: { name: string };
}

interface GenerateContentResponse {
  content: ContentItem;
  tokens: number;
}

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateContent: builder.mutation<GenerateContentResponse, GenerateContentRequest>({
      query: (body) => ({
        url: "/content",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Content", "Tokens", "AutomationLog", "Metrics"],
    }),
    getContentFeed: builder.query<ContentItem[], void>({
      query: () => "/content/feed",
      providesTags: ["Content"],
    }),
  }),
});

export const { useGenerateContentMutation, useGetContentFeedQuery } = contentApi;
