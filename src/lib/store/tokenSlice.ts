import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TokenState {
  activeAgentName: string;
}

const initialState: TokenState = {
  activeAgentName: "Sarah Johnson",
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setActiveAgent: (state, action: PayloadAction<string>) => {
      state.activeAgentName = action.payload;
    },
  },
});

export const { setActiveAgent } = tokenSlice.actions;
export default tokenSlice.reducer;
