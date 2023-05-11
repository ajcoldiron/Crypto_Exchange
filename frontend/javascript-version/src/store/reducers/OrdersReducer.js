import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";
// import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import { ethers } from "ethers";
import moment from "moment";

const loadOrderAdpter = createEntityAdapter();

const initialState = loadOrderAdpter.getInitialState({
    status: "not-loaded",
    filledOrders: {},
    cancelledOrders: {}
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

export const loadAllOrders = createAsyncThunk("loadAllOrders/open", async (data) => {
    const provider = data.provider
    const exchange = data.exchange
    const block = await provider.getBlockNumber()

    const orderStream = await exchange.queryFilter('Order', 0, block)
    let allOrders = orderStream.map(event => event.args)

    return allOrders
})

export const subscribeToPurchase = createAsyncThunk("loadOrders/subscribe", (_, thunkAPI) => {
    const currentReducersState = thunkAPI.getState()
    const exchange = currentReducersState.exchangeReducers.exchange
    exchange.on('Order', (id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp, event) => {
        // const order = event.args
        thunkAPI.dispatch(loadOrderSuccess())
      })
})

export const fillOrderInitiate = createAsyncThunk("orders/fill/initiate", async (data) => {
    const provider = data.provider
    const exchange = data.exchange

    const order = data.order
    const signer = await provider.getSigner()
    const transaction = await exchange.connect(signer).fillOrder(order.id)
    await transaction.wait()
    return order
})

export const fillOrderConfirm = createAsyncThunk("orders/fill/confirm", (arg, thunkAPI) => {
    const orderId = arg;
    const currentReducersState = thunkAPI.getState()
    const allOrders  = currentReducersState.ordersReducer.entities
    const filledOrder = allOrders[orderId]
    thunkAPI.dispatch(fillOrderSuccess(filledOrder))
})

export const subscribeToFill = createAsyncThunk("orders/fill/subscribe", (_, thunkAPI) => {
    const currentReducersState = thunkAPI.getState()
    const exchange = currentReducersState.exchangeReducers.exchange
    // Subscribe to "Trade" events
    // This needs to be only subscribed once at the launch of your app
    // The code inside this event handler is isolated from the rest of your code, it works standalone, so it cant access the current state of your reducers
    // You need to dispatch from the event handler to access your code in real-time with your real-time redux state
    exchange.on('Trade', (id, user, tokenGet, amountGet, tokenGive, amountGive, creator, timestamp, event) => {
        const orderId= id.toNumber()
        thunkAPI.dispatch(fillOrderConfirm(orderId))
    })
})

export const cancelOrder = createAsyncThunk("cancelOrder/cancel", async (data) => {
    const provider = data.provider
    const exchange = data.exchange
    const order = data.order
    // try {
        const signer = await provider.getSigner()
        const transaction = await exchange.connect(signer).cancelOrder(order.id)
        await transaction.wait()
    //  } catch (error) {
    //     window.alert(error)
    // }
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
            const filledOrder = action.payload
            if (filledOrder) {
                state.filledOrders[filledOrder.id] = filledOrder
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
            .addCase(loadFilledOrders.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadFilledOrders.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(loadFilledOrders.fulfilled, (state, action) => {
                const orderDictionary = {}

                const newData = action.payload.map(order => ({
                    id: order.id,
                    tokenGet: order.tokenGet,
                    tokenGive: order.tokenGive,
                    amountGet: ethers.utils.formatUnits(order.amountGet),
                    amountGive: ethers.utils.formatUnits(order.amountGive),
                    user: order.user,
                    timestamp: moment(order.timestamp).format("MM/DD/YYYY hh:mm")
                }))

                newData.forEach(order => {
                    orderDictionary[order.id] = order
                })
                state.filledOrders = orderDictionary
                state.status = "idle"
            })
            .addCase(loadCancelledOrders.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadCancelledOrders.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(loadCancelledOrders.fulfilled, (state, action) => {
                const orderDictionary = {}

                const newData = action.payload.map(order => ({
                    id: order.id,
                    tokenGet: order.tokenGet,
                    tokenGive: order.tokenGive,
                    amountGet: ethers.utils.formatUnits(order.amountGet),
                    amountGive: ethers.utils.formatUnits(order.amountGive),
                    user: order.user,
                    timestamp: moment(order.timestamp).format("MM/DD/YYYY hh:mm")
                }))

                newData.forEach(order => {
                    orderDictionary[order.id] = order
                })
                state.cancelledOrders = orderDictionary
                state.status = "idle"
            })
            .addCase(loadAllOrders.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadAllOrders.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(loadAllOrders.fulfilled, (state, action) => {
                const orderDictionary = {}

                const newData = action.payload.map(order => ({
                    id: order.id,
                    tokenGet: order.tokenGet,
                    tokenGive: order.tokenGive,
                    amountGet: order.amountGet,
                    amountGive: order.amountGive,
                    user: order.user,
                    timestamp: order.timestamp
                }))
                // amountGet: ethers.utils.formatUnits(order.amountGet),
                // amountGive: ethers.utils.formatUnits(order.amountGive),
                // timestamp: moment(order.timestamp).format("MM/DD/YYYY hh:mm")

                newData.forEach(order => {
                    orderDictionary[order.id] = order
                })
                state.entities = orderDictionary
                state.status = "idle"
            })
            .addCase(fillOrderInitiate.pending, (state) => {
                state.status = "loading"
            })
            .addCase(fillOrderInitiate.rejected, (state, action) => {
                window.alert(action.error.message)
                // window.alert(JSON.stringify(action.error))
                state.status = "failed"
            })
            .addCase(fillOrderInitiate.fulfilled, (state, action) => {
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
            .addCase(fillOrderConfirm.pending, (state) => {
                state.status = "loading"
            })
            .addCase(fillOrderConfirm.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(fillOrderConfirm.fulfilled, (state) => {
                state.status = "idle"
            })
    }
})

export const { loadOrderSuccess, cancelOrderSuccess, fillOrderSuccess } = loadOrderSlice.actions;

export default loadOrderSlice.reducer;
