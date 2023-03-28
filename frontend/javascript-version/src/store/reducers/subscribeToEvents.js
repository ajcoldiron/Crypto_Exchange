import { ethers } from 'ethers'
import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

const subscribeToEventsAdpter = createEntityAdapter();

const initialState = subscribeToEventsAdpter.getInitialState({
    transferType: null,
    status: "not-loaded"
})

// export const subscribeToEvents = (exchange, dispatch) => {
//     exchange.on('Cancel', (id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp, event) => {
//       const order = event.args
//       dispatch({ type: 'ORDER_CANCEL_SUCCESS', order, event })
//     })
  
//     exchange.on('Trade', (id, user, tokenGet, amountGet, tokenGive, amountGive, creator, timestamp, event) => {
//       const order = event.args
//       dispatch({ type: 'ORDER_FILL_SUCCESS', order, event })
//     })
  
//     exchange.on('Deposit', (token, user, amount, balance, event) => {
//       dispatch({ type: 'TRANSFER_SUCCESS', event })
//     })
  
//     exchange.on('Withdraw', (token, user, amount, balance, event) => {
//       dispatch({ type: 'TRANSFER_SUCCESS', event })
//     })
  
//     exchange.on('Order', (id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp, event) => {
//       const order = event.args
//       dispatch({ type: 'NEW_ORDER_SUCCESS', order, event })
//     })
// }

export const subscribeToEvents = createAsyncThunk("subscribeToEvents/initsubscribeToEvents", async (data) => {
    
})

const subscribeToEventsSlice = createSlice({
    name: 'exchange',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(subscribeToEvents.pending, (state) => {
                state.status = "loading"
            })
            .addCase(subscribeToEvents.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(subscribeToEvents.fulfilled, (state, action) => {
                state.transferType = action.payload.transferType
                state.status = "idle"
            })
    }
})

export default subscribeToEventsSlice.reducer;
