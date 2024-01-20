import { ethers } from 'ethers';
import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

const tokenBalanceAdpter = createEntityAdapter();

const initialState = tokenBalanceAdpter.getInitialState({
    status: "not-loaded"
})


export const loadTokensBalances = createAsyncThunk("tokensBalances/initBalances", async (data) => {
    const account = data.account
    const token1 = data.tokens[0]
    const symbol1 = await token1.symbol()
    const token2 = data.tokens[1]
    const symbol2 = await token2.symbol()

    const token3 = data.tokens[2]
    const symbol3 = await token3.symbol()

    const token4 = data.tokens[3]
    const symbol4 = await token4.symbol()

    const token5 = data.tokens[4]
    const symbol5 = await token5.symbol()

    let balance1 = ethers.utils.formatUnits(await token1.balanceOf(account), 18)
    let balance2 = ethers.utils.formatUnits(await token2.balanceOf(account), 18)
    let balance3 = ethers.utils.formatUnits(await token3.balanceOf(account), 18)
    let balance5 = ethers.utils.formatUnits(await token5.balanceOf(account), 18)
    let balance4 = ethers.utils.formatUnits(await token4.balanceOf(account), 18)

    return {
        token1: [symbol1, balance1],
        token2: [symbol2, balance2],
        token3: [symbol3, balance3],
        token4: [symbol4, balance4],
        token5: [symbol5, balance5],
    }
})

const tokenBalanceSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(loadTokensBalances.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadTokensBalances.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(loadTokensBalances.fulfilled, (state, action) => {
                const tokens = action.payload

                const result = Object.values(tokens).reduce((acc, [value, key]) => {
                    acc[value] = key;
                    return acc;
                }, {});

                state.entities = result
                state.status = "idle"
            })
    }
})

export default tokenBalanceSlice.reducer;