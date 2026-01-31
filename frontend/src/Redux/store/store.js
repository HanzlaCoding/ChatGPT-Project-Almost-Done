import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../reducers/ChatSlice";

export const store = configureStore({
    reducer: {
        chat: chatReducer
    }
})