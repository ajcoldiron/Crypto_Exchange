import { ethers } from 'ethers';
import tokenAbi from '../../abis/Token.json'
import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

const tokenAdpter = createEntityAdapter();

const initialState = tokenAdpter.getInitialState({
    status: "not-loaded"
})

export const loadTokens = createAsyncThunk("tokens/initTokens", async (data) => {
    let token1 = new ethers.Contract(data.addresses[0], tokenAbi, data.provider)
    let symbol1 = await token1.symbol()

    let token2 = new ethers.Contract(data.addresses[1], tokenAbi, data.provider)
    let symbol2 = await token2.symbol()

    let token3 = new ethers.Contract(data.addresses[2], tokenAbi, data.provider)
    let symbol3 = await token3.symbol()

    let token4 = new ethers.Contract(data.addresses[3], tokenAbi, data.provider)
    let symbol4 = await token4.symbol()

    let token5 = new ethers.Contract(data.addresses[4], tokenAbi, data.provider)
    let symbol5 = await token5.symbol()

    let token6 = new ethers.Contract(data.addresses[5], tokenAbi, data.provider)
    let symbol6 = await token6.symbol()

    return ({ 
        token1: [token1, symbol1], 
        token2: [token2, symbol2], 
        token3: [token3, symbol3], 
        token4: [token4, symbol4], 
        token5: [token5, symbol5], 
        token6: [token6, symbol6] 
    })
})

export const loadTokenBalances = createAsyncThunk("balances/initBalances", async (data) => {
    let balance1 = ethers.utils.formatUnits(await data.tokens[0].balanceOf(data.account.address), 18)
    let balance2 = ethers.utils.formatUnits(await data.tokens[1].balanceOf(data.account.address), 18)

    return { balance1, balance2 }
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
                const tokens = action.payload
                const tokenDictionary = {}
                const tokenObject = Object.values(tokens)

                const key = ['token', 'symbol']
                const result = tokenObject.map(row =>
                row.reduce((acc, cur, i) =>
                    (acc[key[i]] = cur, acc), {}))


                result.forEach(cryptoValue => {
                    tokenDictionary[cryptoValue.symbol] = cryptoValue
                })
                
                state.entities = tokenDictionary
                state.status = "idle"
            })
            .addCase(loadTokenBalances.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadTokenBalances.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(loadTokenBalances.fulfilled, (state, action) => {
                // state.entities.token1.token1Balance = action.payload.balance1
                // state.token1Balance = action.payload.balance1
                // state.token2Balance = action.payload.balance2
                state.status = "idle"
            })
    }
})

export default tokenSlice.reducer;