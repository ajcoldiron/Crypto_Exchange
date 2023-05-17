import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import cryptoReducers, { fetchCryptos } from "../store/reducers/cryptoReducers";
import connectionReducers from "../store/reducers/connectionReducers";
import tokenReducers from "../store/reducers/tokenReducers";
import exchangeReducers from "../store/reducers/exchangeReducers";
import exchangeBalanceReducers from "../store/reducers/exchangeBalanceReducers";
import transferReducers from "../store/reducers/transferReducers";
import purchaseReducer from "../store/reducers/purchaseReducer";
import ordersReducer from "../store/reducers/ordersReducer";
import tokenBalanceReducer from "../store/reducers/tokenBalanceReducer"

const persistConfig = {
    key: 'root',
    version: 1, //added for purge
    blacklist: [
        "connectionReducers",
        "tokenReducers",
        "exchangeReducers"
    ],
    storage,
}

const rootReducer = combineReducers({
    cryptoReducers,
    tokenReducers,
    tokenBalanceReducer,
    exchangeReducers,
    exchangeBalanceReducers,
    ordersReducer,
    purchaseReducer,
    transferReducers,
    connectionReducers
})



export const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false
        }),
})

export const persistor = persistStore(store)

export const initAllData = () => {
    const allReducersState = store.getState()
    const cryptoKeys = Object.keys(allReducersState.cryptoReducers.entities)
    // Only load cryptos at app start if there is no data
    if(!cryptoKeys.length) {
        store.dispatch(fetchCryptos())
    }
}