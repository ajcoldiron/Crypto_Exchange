import { Contract, ethers } from 'ethers'
import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

const exchangeAdpter = createEntityAdapter();

const initialState = exchangeAdpter.getInitialState({
    exchange: {},
    token1Balance: "",
    token2Balance: "",
    status: "not-loaded"
})

export const loadExchangeBalances = createAsyncThunk("balances/initBalances", async (data) => {
    let exchange = data.exchange
    let tokens = data.tokens
    let account = data.account
    let balance1 = ethers.utils.formatUnits(await exchange.balanceOf(tokens[0], account), 18)
    // let balance2 = ethers.utils.formatUnits(await exchange.balanceOf(tokens[1], account), 18)

    return { balance1 }
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
            .addCase(loadExchangeBalances.rejected, (state, action) => {
                console.log(action)
                state.status = "failed"
            })
            .addCase(loadExchangeBalances.fulfilled, (state, action) => {
                state.token1Balance = action.payload.balance1
                // state.token2Balance = action.payload.balance2
                console.log(action)
                state.status = "idle"
            })
    }
})

export default exchangeBalanceSlice.reducer;