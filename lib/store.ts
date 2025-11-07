import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { educationApi } from "./api/educationApi"
import { questionsApi } from "./api/saveQuestionsApi"
import { paperGenerationApi } from "./api/paperGeneration"
import { authApi } from "./api/authApi"
import { profileApi } from "./api/profileApi"
import { dashboardStatsApi } from "./api/dashboardApi"
import { plansApi } from "./api/plansApi"

export const store = configureStore({
  reducer: {
    [educationApi.reducerPath]: educationApi.reducer,
    [questionsApi.reducerPath]: questionsApi.reducer,
    [paperGenerationApi.reducerPath]: paperGenerationApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [dashboardStatsApi.reducerPath]: dashboardStatsApi.reducer,
    [plansApi.reducerPath]: plansApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      educationApi.middleware,
      questionsApi.middleware,
      paperGenerationApi.middleware,
      authApi.middleware,
      profileApi.middleware,
      dashboardStatsApi.middleware,
      plansApi.middleware,
    ),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
