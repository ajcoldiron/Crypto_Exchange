import { configureStore } from "@reduxjs/toolkit";
import cryptoReducers, { fetchCryptos } from "../store/reducers/cryptoReducers";
import connectionReducers from "../store/reducers/connectionReducers";
import tokenReducers from "../store/reducers/tokenReducers";
import exchangeReducers from "../store/reducers/exchangeReducers";
import exchangeBalanceReducers from "../store/reducers/exchangeBalanceReducers";
import transferReducers from "../store/reducers/transferReducers";
import purchaseReducer from "../store/reducers/purchaseReducer";

export const store = configureStore({
    reducer: {
        cryptoReducers,
        connectionReducers,
        tokenReducers,
        exchangeReducers,
        exchangeBalanceReducers,
        purchaseReducer,
        transferReducers
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export const initAllData = () => {
    store.dispatch(fetchCryptos())
}