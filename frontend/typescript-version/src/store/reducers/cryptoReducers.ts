import { createSlice, createEntityAdapter, createAsyncThunk, EntityState } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../core/redux";
import { ICrypto } from "../../typings/crypto";

interface CryptoReducerState extends EntityState<ICrypto> {
    status: "not-loaded" | "loading"| "failed"| "idle",
    selectedCryptos: Array<ICrypto>,
    selectedCrypto: ICrypto | null,
    error: string
}

interface ICryptoDictionary {
    [cryptoId: string]: ICrypto
}

const cryptoAdapter = createEntityAdapter<ICrypto>();

const initialState: CryptoReducerState = {
    ...cryptoAdapter.getInitialState(),
    status: "idle",
    selectedCryptos: [],
    selectedCrypto: null,
    error: ""
}

export const fetchCryptos = createAsyncThunk("crypto/fetchCryptos", async () => {
    const cryptos = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false")
    return cryptos.data
})

const cryptoSlice = createSlice({
    name: "cryptos",
    initialState,
    reducers: {
        cryptoAdded: cryptoAdapter.addOne,
        cryptoRemoved: cryptoAdapter.removeOne,
        cryptoSelect: (state, action) => {
            const selectedCrypto: ICrypto = action.payload
            state.selectedCrypto = selectedCrypto
        },
        cryptoUnselect: (state) => {
            state.selectedCrypto = null
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchCryptos.pending, (state) => {
                state.status = "loading"
                state.ids = []
                state.entities = {}
            })
            .addCase(fetchCryptos.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.error.message ?? ""
            })
            .addCase(fetchCryptos.fulfilled, (state, action) => {
                const cryptos: ICrypto[] = action.payload;
                const cryptoDictionary: ICryptoDictionary = {};
                cryptos.forEach(crypto => {
                    cryptoDictionary[crypto.id] = crypto;
                })
                state.status = "idle"
                state.entities = cryptoDictionary
                state.ids = Object.keys(cryptoDictionary)
            })
    }
})

export const { cryptoAdded, cryptoRemoved, cryptoSelect, cryptoUnselect } = cryptoSlice.actions;

export const cryptoSelectors = cryptoAdapter.getSelectors((state: RootState) => state.cryptoReducers)

export default cryptoSlice.reducer;
