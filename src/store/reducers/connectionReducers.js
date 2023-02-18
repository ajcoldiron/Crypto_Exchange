import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from 'ethers'
import tokenAbi from '../abis/Token.json'
import exchangeAbi from '../abis/Exchange.json'

const connectionAdpter = createEntityAdapter();

const initialState = connectionAdpter.getInitialState({
    status: 'idle',

})

export const loadProvider = () => {
    const connection = new ethers.providers.Web3Provider(window.ethereum)
    return connection
}

export const loadNetwork = async  (provider) => {
    const { chainId } = await provider.getNetwork()
    return chainId
}

export const loadAccount = async (provider) => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts '})
    const account = await ethers.utils.getAddress(accounts[0])

    const balance = await provider.getBalance(account)
    balance = ethers.utils.formatUnits(balance)

    return account
}

export const loadTokens = async (provider, addresses) => {
    let token, symbol

    token = new ethers.Contract(addresses[0], tokenAbi, provider)
    symbol = await token.symbol()

    token = new ethers.Contract(addresses[1], tokenAbi, provider)
    symbol = await token.symbol()

    return token
}

export const loadExchange = async (provider, address) => {
    const exchange = new ethers.Contract(address, exchangeAbi, provider)
    return exchange
}

const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        providerLoaded: (state, action) => {
            state.connection = action.payload
        },
        networkLoaded: (state, action) => {
            state.chainId = action.payload
        },
        accountLoaded: (state, action) => {
            state.account = action.payload
        },
        tokenLoaded: (state, action) => {
            state.token = action.payload
        },
        exchangeLoaded: (state, action) => {
            state.exchange = action.payload
        }
    },
    extraReducers(builder) {
        builder
            .addCase
    }
})

export const { providerLoaded, networkLoaded, accountLoaded, tokenLoaded, exchangeLoaded } = connectionSlice.actions;

export const connectionSelectors = connectionAdpter.getSelectors(state => state.cryptoReduce);

export default connectionSlice.reducer;
