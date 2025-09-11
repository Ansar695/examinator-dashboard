import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { educationApi } from "./api/educationApi"

export const store = configureStore({
  reducer: {
    [educationApi.reducerPath]: educationApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(educationApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
