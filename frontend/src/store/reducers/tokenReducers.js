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

    return ({
        token1: [token1, symbol1],
        token2: [token2, symbol2],
        token3: [token3, symbol3],
        token4: [token4, symbol4],
        token5: [token5, symbol5],
    })
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

                const tokenDictionary = Object.entries(tokens).reduce((acc, [key, value]) => {
                    const [contract, symbol] = value;
                    acc[symbol] = contract;
                    return acc;
                }, {});

                state.entities = tokenDictionary
                state.status = "idle"
            })
    }
})

export default tokenSlice.reducer;