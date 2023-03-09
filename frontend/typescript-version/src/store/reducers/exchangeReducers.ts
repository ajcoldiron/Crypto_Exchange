import { ethers } from 'ethers'
import exchangeAbi from '../../abis/Exchange.json'
import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

interface ITokenState {
    exchange: any;
    status: "not-loaded" | "loading" | "failed" | "idle";
}

const initialState: ITokenState = {
    exchange: {},
    status: "not-loaded"
}

export const loadExchange = createAsyncThunk("exchange/initExchange", async (provider: any, address: any) => {
    let exchange = new ethers.Contract(address, exchangeAbi, provider)
    return exchange
})


const exchangeSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(loadExchange.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadExchange.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(loadExchange.fulfilled, (state, action) => {
                state.exchange = action.payload
                state.status = "idle"
            })
    }
})

export default exchangeSlice.reducer;

