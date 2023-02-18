import { configureStore } from "@reduxjs/toolkit";
import cryptoReducers, { fetchCryptos } from "../store/reducers/cryptoReducers";
import connectionReducers, { initEthersConnection } from "../store/reducers/connectionReducers";

export const store = configureStore({
    reducer: {
        cryptoReducers,
        connectionReducers
    }
})

export type RootState = ReturnType<typeof store.getState>;

export const initAllData = () => {
    store.dispatch(fetchCryptos())
    store.dispatch(initEthersConnection())
}