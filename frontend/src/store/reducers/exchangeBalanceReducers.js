import { ethers } from 'ethers'
import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

const exchangeBalanceAdpter = createEntityAdapter();

const initialState = exchangeBalanceAdpter.getInitialState({
    status: "not-loaded"
})

export const loadExchangeBalances = createAsyncThunk("exchangeBalances/initBalances", async (data, thunkAPI) => {
    const exchange = data.exchange
    // let exchange = thunkAPI.getState().exchangeReducer.exchange
    const tokens = data.tokens
    const account = data.account
    const balance1 = ethers.utils.formatUnits(await exchange.balanceOf(tokens[0].address, account), 18)
    const balance2 = ethers.utils.formatUnits(await exchange.balanceOf(tokens[1].address, account), 18)
    const balance3 = ethers.utils.formatUnits(await exchange.balanceOf(tokens[2].address, account), 18)
    const balance4 = ethers.utils.formatUnits(await exchange.balanceOf(tokens[3].address, account), 18)
    const balance5 = ethers.utils.formatUnits(await exchange.balanceOf(tokens[4].address, account), 18)
    const balance6 = ethers.utils.formatUnits(await exchange.balanceOf(tokens[5].address, account), 18)
    const symbol1 = await tokens[0].symbol()
    const symbol2 = await tokens[1].symbol()
    const symbol3 = await tokens[2].symbol()
    const symbol4 = await tokens[3].symbol()
    const symbol5 = await tokens[4].symbol()
    const symbol6 = await tokens[5].symbol()
    
    return {
      token1: [symbol1, balance1],
      token2: [symbol2, balance2],
      token3: [symbol3, balance3],
      token4: [symbol4, balance4],
      token5: [symbol5, balance5],
      token6: [symbol6, balance6]
    }
})


const exchangeBalanceSlice = createSlice({
    name: 'exchangeBalance',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(loadExchangeBalances.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadExchangeBalances.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(loadExchangeBalances.fulfilled, (state, action) => {
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

export default exchangeBalanceSlice.reducer;