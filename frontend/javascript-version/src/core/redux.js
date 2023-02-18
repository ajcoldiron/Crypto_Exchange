import { configureStore } from "@reduxjs/toolkit";
import cryptoReducers, { fetchCryptos } from "../store/reducers/cryptoReducers";

export const store = configureStore({
    reducer: {
        cryptoReducers
    }
})

export const initAllData = () => {
    store.dispatch(fetchCryptos())
}