import { configureStore } from "@reduxjs/toolkit";
import cryptoReducers, { fetchCryptos } from "../store/reducers/cryptoReducers";
import connectionReducers, { initAccountConnection } from "../store/reducers/connectionReducers";
import tokenReducers from "../store/reducers/tokenReducers";
import exchangeReducers from "../store/reducers/exchangeReducers";

export const store = configureStore({
    reducer: {
        cryptoReducers,
        connectionReducers,
        tokenReducers,
        exchangeReducers
    }
})

export type RootState = ReturnType<typeof store.getState>;

export const initAllData = () => {
    store.dispatch(fetchCryptos())
    // store.dispatch(initAccountConnection())
}