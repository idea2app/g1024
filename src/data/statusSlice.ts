import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import {
  ProvingParams,
  StatusState,
  QueryParams,
  WithSignature,
} from "zkwasm-service-helper";

const initialState: StatusState = {
  tasks: [],
  loaded: false,
  statistics: {
    totalImages: 0,
    totalProofs: 0,
    totalDeployed: 0,
    totalTasks: 0,
  },
};

export const loadStatus = createAsyncThunk(
  "status/fetchStatus",
  async (query: QueryParams, thunkApi) => {
    let state = thunkApi.getState() as RootState;
    let helper = state.endpoint.zkWasmServiceHelper;
    let tasks = (await helper.loadTasks(query)).data;
    return tasks;
  }
);

export const addProvingTask = createAsyncThunk(
  "status/addProveTask",
  async (task: WithSignature<ProvingParams>, thunkApi) => {
    let state = thunkApi.getState() as RootState;
    let helper = state.endpoint.zkWasmServiceHelper;
    let response = await helper.addProvingTask(task);
    return response;
  }
);

export const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    updateState: (state, d) => {
      state.tasks = d.payload.tasks;
      state.loaded = d.payload.loaded;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadStatus.fulfilled, (state, c) => {
      console.log("payload", c.payload);
      state.tasks = c.payload;
      state.loaded = true;
    });
  },
});

export const { updateState } = statusSlice.actions;
export const selectTasks = (state: RootState) => state.status.tasks;
export const tasksLoaded = (state: RootState) => state.status.loaded;
export default statusSlice.reducer;
