import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment"

const cryptoAdapter = createEntityAdapter();

const initialState = {
    ...cryptoAdapter.getInitialState(),
    status: "idle",
    selectedCryptos: [],
    selectedCrypto: null,
    error: "",
    currentCryptoData: null,
    comparedIntervalData: [],
    cachedIntervalData: {},
    cacheDataLastUpload: {}
}

export const fetchCryptos = createAsyncThunk("crypto/fetchCryptos", async () => {
    const cryptos = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false")
    return cryptos.data
})


export const fetchCryptoDataWithInterval = createAsyncThunk("crypto/fetchCryptoIntervalData", async ({cryptoId, days = 365, interval = "monthly", currency ="usd"}, thunkAPI) => {
    const cachedIntervalData = thunkAPI.getState().cryptoReducers.cachedIntervalData;
    const cacheDataLastUpload = thunkAPI.getState().cryptoReducers.cacheDataLastUpload;
    let currentCachedIntervalData = null
    if(cryptoId in cachedIntervalData) {
        currentCachedIntervalData = cachedIntervalData[cryptoId]
    }

    // Calculate if cached data should be queried again
    let isDataOlderThanOneDay = false;
     
    if(Date.now() > cacheDataLastUpload[cryptoId] + 604800) { //older that 1 week then refresh
        isDataOlderThanOneDay = true;
    }
   
    if (currentCachedIntervalData && !isDataOlderThanOneDay) {

        let date = new Date(cacheDataLastUpload[cryptoId])
        const dateTime = moment(date).format("MM/DD/YYYY hh:mm")
        return {
            cryptoId,
            intervalData: currentCachedIntervalData,
            lastUpdated: dateTime
        };
    } else {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=${currency}&days=${days}&interval=${interval}`);
        return {
            cryptoId,
            intervalData: response.data,
            lastUpdated: moment(Date.now()).format("MM/DD/YYYY hh:mm")
        };
    }
})

const cryptoSlice = createSlice({
    name: "cryptos",
    initialState,
    reducers: {
        cryptoAdded: cryptoAdapter.addOne,
        cryptoRemoved: cryptoAdapter.removeOne,
        cryptoSelect: (state, action) => {
            state.selectedCrypto = action.payload
        },
        cryptoUnselect: (state) => { 
            state.selectedCrypto = null
        },
        selectPurchaseCrypto: (state, action) => {
            state.purchaseCrypto = action.payload
        },
        selectSellCrypto: (state, action) => {
            state.sellCrypto = action.payload
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
                state.error = action.error.message
            })
            .addCase(fetchCryptos.fulfilled, (state, action) => {
                const cryptos = action.payload;
                const cryptoDictionary = {};
                cryptos.forEach(crypto => {
                    cryptoDictionary[crypto.symbol] = crypto;
                })
                state.status = "idle"
                state.entities = cryptoDictionary
                state.ids = Object.keys(cryptoDictionary) 
            })
            .addCase(fetchCryptoDataWithInterval.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(fetchCryptoDataWithInterval.rejected, (state, action) => {
                state.status = 'failed'
                window.alert(action.error.message)
            })
            .addCase(fetchCryptoDataWithInterval.fulfilled, (state, action) => {
                state.status = "idle"
                const {intervalData, cryptoId, lastUpdated} = action.payload;
                state.cachedIntervalData[cryptoId] = intervalData
                state.cacheDataLastUpload[cryptoId] = lastUpdated
                state.currentCryptoData = intervalData
            })
    }
})

export const { cryptoAdded, cryptoRemoved, cryptoSelect, cryptoUnselect, selectPurchaseCrypto, selectSellCrypto } = cryptoSlice.actions;

export const cryptoSelectors = cryptoAdapter.getSelectors(state => state.cryptoReducers)

export default cryptoSlice.reducer;
