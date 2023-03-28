import { ethers } from 'ethers'
import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

const purchaseAdpter = createEntityAdapter();

const initialState = purchaseAdpter.getInitialState({
    order: {},
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

    try{
        const signer = await provider.getSigner()
        const transaction = await exchange.connect(signer).makeOrder(tokenGet, amountGet, tokenGive, amountGive)
        await transaction.wait()
    } catch (error) {
        window.alert(error)
    }
})

const purchaseSlice = createSlice({
    name: 'exchange',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(purchase.pending, (state) => {
                state.status = "loading"
            })
            .addCase(purchase.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(purchase.fulfilled, (state, action) => {
                state.order = action.payload
                state.status = "idle"
            })
    }
})

export default purchaseSlice.reducer;
