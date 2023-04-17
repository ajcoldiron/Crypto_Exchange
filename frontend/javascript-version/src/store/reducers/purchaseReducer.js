import { ethers } from 'ethers'
import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

const purchaseAdpter = createEntityAdapter();

const initialState = purchaseAdpter.getInitialState({
    status: "not-loaded"
})

export const purchase = createAsyncThunk("purchase/initPurchase", async (data) => {
    let provider = data.provider
    let exchange = data.exchange
    let tokens = data.tokens
    let order = data.order
    const tokenGet = tokens[0].address
    const amountGet = ethers.utils.parseUnits(order.amount, 18)
    const tokenGive = tokens[1].address
    const amountGive = ethers.utils.parseUnits((order.amount * order.price).toString(), 18)
    let transaction
    try{
        const signer = await provider.getSigner()
        transaction = await exchange.connect(signer).makeOrder(tokenGet, amountGet, tokenGive, amountGive)
        await transaction.wait()
    } catch (error) {
        window.alert(error)
    }
    return transaction
})

export const subscribeToPurchase = createAsyncThunk("purchase/subscribe", (_, thunkAPI) => {
    const currentReducersState = thunkAPI.getState()
    const exchange = currentReducersState.exchangeReducers.exchange
    exchange.on('Order', (id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp, event) => {
        const order = event.args
        thunkAPI.dispatch(purchaseSuccess())
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
                console.log(action)
                state.status = "failed"
            })
            .addCase(purchase.fulfilled, (state, action) => {
                console.log(action)
                state.entities.orders = action.payload
                state.status = "idle"
            })
    }
})

export const { purchaseSuccess } = purchaseSlice.actions;

export default purchaseSlice.reducer;
