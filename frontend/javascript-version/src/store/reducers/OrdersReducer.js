import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

const loadOrderAdpter = createEntityAdapter();

const initialState = loadOrderAdpter.getInitialState({
    status: "not-loaded"
})

export const loadAllOrders = createAsyncThunk("loadAllOrders/open", async (data) => {
    const provider = data.provider
    const exchange = data.exchange
    const block = await provider.getBlockNumber()

    const orderStream = await exchange.queryFilter('Order', 0, block)
    const allOrders = orderStream.map(event => event.args)

    return allOrders
})

export const loadCancelledOrders = createAsyncThunk("loadCancelledOrders/cancelled", async (data) => {
    const provider = data.provider
    const exchange = data.exchange
    const block = await provider.getBlockNumber()

    const cancelStream = await exchange.queryFilter('Cancel', 0, block)
    const cancelledOrders = cancelStream.map(event => event.args)

    return cancelledOrders
})

export const loadFilledOrders = createAsyncThunk("loadFilledOrders/filled", async (data) => {
    const provider = data.provider
    const exchange = data.exchange
    const block = await provider.getBlockNumber()

    const tradeStream = await exchange.queryFilter('Trade', 0, block)
    const filledOrders = tradeStream.map(event => event.args)

    return filledOrders
})

export const subscribeToPurchase = createAsyncThunk("loadOrders/subscribe", (_, thunkAPI) => {
    const currentReducersState = thunkAPI.getState()
    const exchange = currentReducersState.exchangeReducers.exchange
    exchange.on('Order', (id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp, event) => {
        // const order = event.args
        thunkAPI.dispatch(loadOrderSuccess())
      })
})

export const fillOrder = createAsyncThunk("fillOrder/fill", async (data) => {
    const provider = data.provider
    const exchange = data.exchange
    const order = data.order
    try {
        const signer = await provider.getSigner()
        const transaction = await exchange.connect(signer).fillOrder(order.id)
        await transaction.wait()
    } catch (error) {
        window.alert(error)
    }
    // return data
})

export const subscribeToFill = createAsyncThunk("fill/subscribe", (_, thunkAPI) => {
    const currentReducersState = thunkAPI.getState()
    const exchange = currentReducersState.exchangeReducers.exchange
    exchange.on('Trade', (id, user, tokenGet, amountGet, tokenGive, amountGive, creator, timestamp, event) => {
        // const order = event.args
        thunkAPI.dispatch(fillOrderSuccess())
    })
})

export const cancelOrder = createAsyncThunk("cancelOrder/cancel", async (data) => {
    const provider = data.provider
    const exchange = data.exchange
    const order = data.order
    try {
        const signer = await provider.getSigner()
        const transaction = await exchange.connect(signer).cancelOrder(order.id)
        await transaction.wait()
        console.log(transaction)
      } catch (error) {
        window.alert(error)
    }
})

export const subscribeToCancel = createAsyncThunk("cancel/subscribe", (_, thunkAPI) => {
    const currentReducersState = thunkAPI.getState()
    const exchange = currentReducersState.exchangeReducers.exchange
    exchange.on('Cancel', (id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp, event) => {
        // const order = event.args
        thunkAPI.dispatch(cancelOrderSuccess())
    })
})

const loadOrderSlice = createSlice({
    name: 'exchange',
    initialState,
    reducers: {
        loadOrderSuccess: (state, action) => {
            return {
                ...state,
                event: action.event
            }
        },
        fillOrderSuccess: (state, action) => {
            return {
                ...state,
                event: action.event
            }
        },
        cancelOrderSuccess: (state, action) => {
            return {
                ...state,
                event: action.event
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(loadAllOrders.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadAllOrders.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(loadAllOrders.fulfilled, (state, action) => {
                state.entities.allOrders = action.payload
                state.status = "idle"
            })
            .addCase(loadFilledOrders.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadFilledOrders.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(loadFilledOrders.fulfilled, (state, action) => {
                state.entities.filledOrders = action.payload
                state.status = "idle"
            })
            .addCase(loadCancelledOrders.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadCancelledOrders.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(loadCancelledOrders.fulfilled, (state, action) => {
                state.entities.cancelledOrders = action.payload
                state.status = "idle"
            })
            .addCase(fillOrder.pending, (state) => {
                state.status = "loading"
            })
            .addCase(fillOrder.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(fillOrder.fulfilled, (state, action) => {
                // console.log(action)
                state.status = "idle"
            })
            .addCase(cancelOrder.pending, (state) => {
                state.status = "loading"
            })
            .addCase(cancelOrder.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(cancelOrder.fulfilled, (state) => {
                state.status = "idle"
            })
    }
})

export const { loadOrderSuccess, cancelOrderSuccess, fillOrderSuccess } = loadOrderSlice.actions;

export default loadOrderSlice.reducer;
