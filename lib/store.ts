import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { educationApi } from "./api/educationApi"
import { questionsApi } from "./api/saveQuestionsApi"

export const store = configureStore({
  reducer: {
    [educationApi.reducerPath]: educationApi.reducer,
    [questionsApi.reducerPath]: questionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(educationApi.middleware, questionsApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
