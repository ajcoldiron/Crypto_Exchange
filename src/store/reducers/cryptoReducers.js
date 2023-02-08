import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const cryptoAdapter = createEntityAdapter();

const initialState = cryptoAdapter.getInitialState({
    status: "not-loaded",
    ids: [],
    entities: {},
    selectedCryptos: []
})

export const fetchCryptos = createAsyncThunk("crypto/fetchCryptos", async () => {
    const cryptos = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false")
    return cryptos.data
})

const cryptoSlice = createSlice({
    name: "cryptos",
    initialState,
    reducers: {
        cryptoRemoved: cryptoAdapter.removeOne,
        cryptoSelect: (state, action) => {
            const selectedCrypto = action.payload
            state.selectedCryptos = [...state.selectedCryptos, selectedCrypto]
        },
        cryptoUnselect: (state, action) => {
            const unselectCrypto = action.payload
            if(state.selectedCryptos.includes(unselectCrypto)) {
                state.selectedCryptos = [...state.selectedCryptos.filter(crypto => crypto !== unselectCrypto)]
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchCryptos.pending, (state) => {
                state.status = "loading"
                state.ids = []
                state.entities = {}
            })
    }
})

export const { cryptoRemoved, cryptoSelect, cryptoUnselect } = cryptoSlice.actions;

export const cryptoSelectors = cryptoAdapter.getSelectors(state => state.cryptoReducer)

export default cryptoSlice.reducer;
