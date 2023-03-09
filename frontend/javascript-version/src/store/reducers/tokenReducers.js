import { ethers } from 'ethers';
import tokenAbi from '../../abis/Token.json'
import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

const tokenAdpter = createEntityAdapter();

const initialState = tokenAdpter.getInitialState({
    token1: {},
    token1Symbol: "",
    token1Balance: "",
    token2: {},
    token2Symbol: "",
    token2Balance: "",
    status: "not-loaded"
})

export const loadTokens = createAsyncThunk("tokens/initTokens", async (data) => {
    let token1 = new ethers.Contract(data.addresses[0], tokenAbi, data.provider)
    let symbol1 = await token1.symbol()

    let token2 = new ethers.Contract(data.addresses[1], tokenAbi, data.provider)
    let symbol2 = await token2.symbol()

    return ({ token1, symbol1, token2, symbol2 })
})

export const loadTokenBalances = createAsyncThunk("balances/initBalances", async (data) => {
    let balance1 = ethers.utils.formatUnits(await data.tokens[0].balanceOf(data.account), 18)
    let balance2 = ethers.utils.formatUnits(await data.tokens[1].balanceOf(data.account), 18)

    return ({ balance1, balance2 })
})

const tokenSlice = createSlice({
    name: 'token',
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
                state.token1 = action.payload.token1.address
                state.token1Symbol = action.payload.symbol1
                state.token2 = action.payload.token2.address
                state.token2Symbol = action.payload.symbol2
                state.status = "idle"
            })
            .addCase(loadTokenBalances.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadTokenBalances.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(loadTokenBalances.fulfilled, (state, action) => {
                state.token1Balance = action.payload.balance1
                state.token2Balance = action.payload.balance2
                state.status = "idle"
            })
    }
})

export default tokenSlice.reducer;