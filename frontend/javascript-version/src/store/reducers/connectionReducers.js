import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from 'ethers'

const connectionAdpter = createEntityAdapter();

const initialState = connectionAdpter.getInitialState({
    status: 'idle',
    ethersConnection: null,
    network: {},
    account: "",
    balance: {}
})

export const loadProvider = createAsyncThunk("connection/initConnection", () => {
    const connection = new ethers.providers.Web3Provider(window.ethereum)
    return connection
})

export const loadNetwork = createAsyncThunk("network/initNetwork", async (provider) => {
    const { chainId } = await provider.getNetwork()
    return chainId
})

export const initAccountConnection = createAsyncThunk("account/initAccount", async (provider) => {
    let account, balance
    try{
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        account = ethers.utils.getAddress(accounts[0])
        balance = await provider.getBalance(account)
        balance = ethers.utils.formatEther(balance)

    } catch(e) {
        console.log(e)
    }
    return ({
        account,
        balance
    })
});


const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(loadProvider.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadProvider.rejected, (state) => {
                state.status = "failed"

            })
            .addCase(loadProvider.fulfilled, (state, action) => {
                state.ethersConnection = action.payload
                state.status = "idle"
            })
            .addCase(loadNetwork.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadNetwork.rejected, (state) => {
                state.status = "failed"

            })
            .addCase(loadNetwork.fulfilled, (state, action) => {
                state.network = action.payload
                state.status = "idle"
            })
            .addCase(initAccountConnection.pending, (state) => {
                state.status = "loading"
            })
            .addCase(initAccountConnection.rejected, (state) => {
                state.status = "failed"

            })
            .addCase(initAccountConnection.fulfilled, (state, action) => {
                state.account = action.payload.account
                state.balance = action.payload.balance
                state.status = "idle"
            })
    }
})

export const connectionSelectors = connectionAdpter.getSelectors(state => state.cryptoReduce);

export default connectionSlice.reducer;
