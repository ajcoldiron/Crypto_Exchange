import { ethers } from 'ethers';
import tokenAbi from '../../abis/Token.json'
import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

interface ITokenState {
    token1: any;
    symbol1: string;
    // token2: any;
    // symbol2: string;
    status: "not-loaded" | "loading" | "failed" | "idle";
}

const initialState: ITokenState = {
    token1: {},
    symbol1: "",
    // token2: {},
    // symbol2: "",
    status: "not-loaded"
}

export const loadTokens = createAsyncThunk("tokens/initTokens", async (provider: any, addresses: any) => {
    let token1 = new ethers.Contract(addresses, tokenAbi, provider)
    let symbol1 = await token1.symbol()

    // let token2 = new ethers.Contract(addresses[1], tokenAbi, provider)
    // let symbol2 = await token2.symbol()

    return{token1, symbol1}
    // , token2, symbol2
})

const tokenSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(loadTokens.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadTokens.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(loadTokens.fulfilled, (state, action) => {
                state.token1 = action.payload.token1
                state.symbol1 = action.payload.symbol1
                // state.token2 = action.payload.token2
                // state.symbol2 = action.payload.symbol2
                state.status = "idle"
            })
    }
})

export default tokenSlice.reducer;
