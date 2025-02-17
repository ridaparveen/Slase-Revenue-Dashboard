import { configureStore } from "@reduxjs/toolkit"
import dataReducer from "./slices/DataSlice"
import filtersReducer from "./slices/FilterSlice"
import salseReducer from "./slices/SalseSlice"

const store = configureStore({
  reducer: {
    data: dataReducer,
    filters: filtersReducer,
    salse:salseReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

