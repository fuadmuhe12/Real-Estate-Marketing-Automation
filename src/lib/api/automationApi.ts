import { baseApi } from "./baseApi";

export interface AutomationLogItem {
  id: string;
  type: string;
  agentId: string;
  contentId: string | null;
  leadId: string | null;
  message: string;
  metadata: string | null;
  createdAt: string;
  agent: { name: string };
  content: { caption: string; audience: string; city: string } | null;
  lead: { name: string; status: string } | null;
}

export const automationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAutomationLog: builder.query<AutomationLogItem[], void>({
      query: () => "/automation/log",
      providesTags: ["AutomationLog"],
    }),
  }),
});

export const { useGetAutomationLogQuery } = automationApi;
