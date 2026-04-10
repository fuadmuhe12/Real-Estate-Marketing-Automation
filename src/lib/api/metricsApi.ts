import { baseApi } from "./baseApi";

interface AgentMetric {
  name: string;
  tokensRemaining: number;
  tokensSpent: number;
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

interface RechargeRequest {
  agentName: string;
  amount: "25" | "50" | "100";
}

interface RechargeResponse {
  name: string;
  tokens: number;
  purchased: number;
}

export interface AgentListItem {
  name: string;
  tokens: number;
}

export const metricsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgents: builder.query<AgentListItem[], void>({
      query: () => "/agents",
      providesTags: ["Tokens"],
    }),
    getMetrics: builder.query<MetricsResponse, void>({
      query: () => "/metrics",
      providesTags: ["Metrics"],
    }),
    getAgentTokens: builder.query<AgentTokensResponse, string>({
      query: (name) => `/agents/${encodeURIComponent(name)}/tokens`,
      providesTags: ["Tokens"],
    }),
    rechargeTokens: builder.mutation<RechargeResponse, RechargeRequest>({
      query: ({ agentName, amount }) => ({
        url: `/agents/${encodeURIComponent(agentName)}/recharge`,
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["Tokens", "Metrics"],
    }),
  }),
});

export const {
  useGetAgentsQuery,
  useGetMetricsQuery,
  useGetAgentTokensQuery,
  useRechargeTokensMutation,
} = metricsApi;
