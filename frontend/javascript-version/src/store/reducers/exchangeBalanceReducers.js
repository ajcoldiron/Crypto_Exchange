import { ethers } from 'ethers'
import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

const exchangeAdpter = createEntityAdapter();

const initialState = exchangeAdpter.getInitialState({
    exchange: null,
    status: "not-loaded"
})

export const loadExchangeBalances = createAsyncThunk("balances/initBalances", async (data) => {
    let exchange = data.exchange
    let tokens = data.tokens
    let account = data.account
    let balance1 = ethers.utils.formatUnits(await exchange.balanceOf(tokens[0].address, account), 18)
    let balance2 = ethers.utils.formatUnits(await exchange.balanceOf(tokens[1].address, account), 18)
    let symbol1 = data.symbols[0]
    let symbol2 = data.symbols[1]
    const tokenBalances = [
        {
          balance: balance1,
          symbol: symbol1
        },
        {
          balance: balance2,
          symbol: symbol2
        }
      ]
    
    return { tokenBalances }
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
                const tokenBalances = action.payload.tokenBalances
                const balanceDictionary = {}
                let balanceValues = Object.values(tokenBalances)
                balanceValues.forEach(balances => {
                    balanceDictionary[balances.symbol] = balances
                })
                // const ids = Object.keys(balanceDictionary)
                state.entities = balanceDictionary
                state.status = "idle"
            })
    }
})

export default exchangeBalanceSlice.reducer;