import { ethers } from 'ethers'
import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";
import { loadAllOrders } from './ordersReducer';

const purchaseAdpter = createEntityAdapter();

const initialState = purchaseAdpter.getInitialState({
    status: "not-loaded"
})

export const purchase = createAsyncThunk("purchase/initiate", async (data) => {
    let provider = data.provider
    let exchange = data.exchange
    let tokens = data.tokens
    const order = data.order
    const tokenGet = tokens[0].address
    const amountGet = ethers.utils.parseUnits(order.amount, 18)
    const tokenGive = tokens[1].address
    const amountGive = ethers.utils.parseUnits((order.amount * order.price).toString(), 18)
    
    const signer = await provider.getSigner()
    let transaction = await exchange.connect(signer).makeOrder(tokenGet, amountGet, tokenGive, amountGive)
    await transaction.wait()
    
    return transaction
})

export const purchaseConfirmed = createAsyncThunk("purchase/confirmed", (arg, thunkAPI) => {
    thunkAPI.dispatch(purchaseSuccess())
})

export const subscribeToPurchase = createAsyncThunk("purchase/subscribe", (_, thunkAPI) => {
    const currentReducersState = thunkAPI.getState()
    const exchange = currentReducersState.exchangeReducers.exchange
    exchange.on('Order', (id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp, event) => {
        const orderId = id.toNumber()
        thunkAPI.dispatch(loadAllOrders(orderId))
      })
})

const purchaseSlice = createSlice({
    name: 'exchange',
    initialState,
    reducers: {
        purchaseSuccess: (state, action) => {
            return {
                ...state,
                event: action.event
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(purchase.pending, (state) => {
                state.status = "loading"
            })
            .addCase(purchase.rejected, (state, action) => {
                window.alert(action.error.message)
                state.status = "failed"
            })
            .addCase(purchase.fulfilled, (state, action) => {
                state.entities.orders = action.payload
                state.status = "idle"
            })
    }
})

export const { purchaseSuccess } = purchaseSlice.actions;

export default purchaseSlice.reducer;
