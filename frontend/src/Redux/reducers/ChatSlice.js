import { createSlice } from "@reduxjs/toolkit";

const initialState = [
    {
        activeChatId: null
    }
];

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        activeChatId: (state, action) => {
            // TODO: Implement logic to set the active chat ID
            state[0].activeChatId = action.payload

        }
    }
})

export const { activeChatId } = chatSlice.actions
export default chatSlice.reducer