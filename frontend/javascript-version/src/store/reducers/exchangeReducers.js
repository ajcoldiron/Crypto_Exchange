import { ethers } from 'ethers'
import exchangeAbi from '../../abis/Exchange.json'
import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

const exchangeAdpter = createEntityAdapter();

const initialState = exchangeAdpter.getInitialState({
    exchange: null,
    status: "not-loaded"
})

export const loadExchange = createAsyncThunk("exchange/initExchange", async (data) => {
    let exchange = new ethers.Contract(data.exchange, exchangeAbi, data.provider)
    return exchange
})


const exchangeSlice = createSlice({
    name: 'exchange',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(loadExchange.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadExchange.rejected, (state, action) => {
                state.status = "failed"
                console.log(action)
            })
            .addCase(loadExchange.fulfilled, (state, action) => {
                state.exchange = action.payload
                state.status = "idle"
            })
    }
})

export default exchangeSlice.reducer;
