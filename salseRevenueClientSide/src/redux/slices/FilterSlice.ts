import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface FiltersState {
  dateRange: [Date | null, Date | null]
  category: string
  region: string
}

const initialState: FiltersState = {
  dateRange: [null, null],
  category: "",
  region: "",
}

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<[Date | null, Date | null]>) => {
      state.dateRange = action.payload
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload
    },
    setRegion: (state, action: PayloadAction<string>) => {
      state.region = action.payload
    },
  },
})

export const { setDateRange, setCategory, setRegion } = filtersSlice.actions
export default filtersSlice.reducer

