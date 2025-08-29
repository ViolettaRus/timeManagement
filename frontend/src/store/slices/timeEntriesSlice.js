import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { timeEntriesApi } from '../../api/mockTimeEntries';

export const fetchTimeEntries = createAsyncThunk(
  'timeEntries/fetchAll',
  async (params, thunkAPI) => {
    try {
      const response = await timeEntriesApi.getTimeEntries(params);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Ошибка загрузки записей времени');
    }
  }
);

export const saveTimeEntry = createAsyncThunk(
  'timeEntries/create',
  async (entryData, thunkAPI) => {
    try {
      const response = await timeEntriesApi.createTimeEntry(entryData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Ошибка сохранения записи времени');
    }
  }
);

const timeEntriesSlice = createSlice({
  name: 'timeEntries',
  initialState: {
    entries: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTimeEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.entries = [];
      })
      .addCase(saveTimeEntry.fulfilled, (state, action) => {
        if (action.payload) {
          state.entries.unshift(action.payload);
        }
      })
      .addCase(saveTimeEntry.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearError } = timeEntriesSlice.actions;
export default timeEntriesSlice.reducer;