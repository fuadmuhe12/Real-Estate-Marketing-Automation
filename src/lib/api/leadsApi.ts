import { baseApi } from "./baseApi";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  status: "new" | "hot" | "cold";
  lastContacted: string;
  createdAt: string;
}

interface SendToAiRequest {
  leadId: string;
  agentName: string;
}

interface SendToAiResponse {
  message: string;
  logType: string;
  tokens: number;
}

export const leadsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query<Lead[], string | undefined>({
      query: (status) => (status ? `/leads?status=${status}` : "/leads"),
      providesTags: ["Leads"],
    }),
    sendLeadToAi: builder.mutation<SendToAiResponse, SendToAiRequest>({
      query: ({ leadId, agentName }) => ({
        url: `/leads/${leadId}/send-to-ai`,
        method: "POST",
        body: { agentName },
      }),
      invalidatesTags: ["Leads", "Tokens", "AutomationLog", "Metrics"],
    }),
  }),
});

export const { useGetLeadsQuery, useSendLeadToAiMutation } = leadsApi;
