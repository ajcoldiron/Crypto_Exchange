import { ethers } from 'ethers'
import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

const exchangeBalanceAdpter = createEntityAdapter();

const initialState = exchangeBalanceAdpter.getInitialState({
    status: "not-loaded"
})

export const loadExchangeBalances = createAsyncThunk("exchangeBalances/initBalances", async (data, thunkAPI) => {
    let exchange = data.exchange
    // let exchange = thunkAPI.getState().exchangeReducer.exchange
    let tokens = data.tokens
    let account = data.account
    let balance1 = ethers.utils.formatUnits(await exchange.balanceOf(tokens[0].address, account), 18)
    let balance2 = ethers.utils.formatUnits(await exchange.balanceOf(tokens[1].address, account), 18)
    let balance3 = ethers.utils.formatUnits(await exchange.balanceOf(tokens[2].address, account), 18)
    let balance4 = ethers.utils.formatUnits(await exchange.balanceOf(tokens[3].address, account), 18)
    let balance5 = ethers.utils.formatUnits(await exchange.balanceOf(tokens[4].address, account), 18)
    let balance6 = ethers.utils.formatUnits(await exchange.balanceOf(tokens[5].address, account), 18)
    let symbol1 = data.symbols[0]
    let symbol2 = data.symbols[1]
    let symbol3 = data.symbols[2]
    let symbol4 = data.symbols[3]
    let symbol5 = data.symbols[4]
    let symbol6 = data.symbols[5]
    const exchangeBalances = [
        {
          balance: balance1,
          symbol: symbol1
        },
        {
          balance: balance2,
          symbol: symbol2
        },
        {
          balance: balance3,
          symbol: symbol3
        },
        {
          balance: balance4,
          symbol: symbol4
        },
        {
          balance: balance5,
          symbol: symbol5
        },
        {
          balance: balance6,
          symbol: symbol6
        }
      ]
    return ({ exchangeBalances })
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
                const exchangeBalances = action.payload.exchangeBalances
                const balanceDictionary = {}
                let balanceValues = Object.values(exchangeBalances)
                balanceValues.forEach(balances => {
                  balanceDictionary[balances.symbol] = balances
                })

                // if (!state.startingBalances) {
                //   state.startingBalances = balanceDictionary
                // }

                state.entities = balanceDictionary
                // if(!state.balanceUploadTime) {
                //   state.balanceUploadTime = action.payload.timestamp
                // }
                state.status = "idle"
            })
    }
})

export default exchangeBalanceSlice.reducer;