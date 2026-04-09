import { baseApi } from "./baseApi";

interface AgentMetric {
  name: string;
  tokensRemaining: number;
  tokensUsed: number;
  postsGenerated: number;
  totalActions: number;
}

export interface MetricsResponse {
  postsGenerated: number;
  leadsContacted: number;
  tokensUsed: number;
  agentMetrics: AgentMetric[];
}

interface AgentTokensResponse {
  name: string;
  tokens: number;
}

export const metricsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMetrics: builder.query<MetricsResponse, void>({
      query: () => "/metrics",
      providesTags: ["Metrics"],
    }),
    getAgentTokens: builder.query<AgentTokensResponse, string>({
      query: (name) => `/agents/${encodeURIComponent(name)}/tokens`,
      providesTags: ["Tokens"],
    }),
  }),
});

export const { useGetMetricsQuery, useGetAgentTokensQuery } = metricsApi;
