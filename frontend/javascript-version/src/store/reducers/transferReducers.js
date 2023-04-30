import { ethers } from 'ethers'
import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment"


const transferAdpter = createEntityAdapter();

const initialState = transferAdpter.getInitialState({
    status: "not-loaded"
})

export const transferTokens = createAsyncThunk("transfer/initTransfer", async (data) => {
    let transaction
    let provider = data.provider
    let exchange = data.exchange
    let transferType = data.transferType
    let token = data.token
    let amount = data.amount
    let transferAmount
    try {
        let signer = await provider.getSigner()
        transferAmount = ethers.utils.parseUnits(amount.toString(), 18)

        if (transferType === 'Deposit') {
            transaction = await token.connect(signer).approve(exchange.address, transferAmount)
            await transaction.wait()
            transaction = await exchange.connect(signer).depositTokens(token.address, transferAmount)
        } else {
            transaction = await exchange.connect(signer).withdrawTokens(token.address, transferAmount)
        }
        await transaction.wait()
    } catch(error) {
        window.alert(error)
    }// eslint-disable-next-line
    return ({ transferType, timestamp: moment(new Date).format("MM/DD/YYYY hh:mm"), transferAmount })
})

export const subscribeToTransfers = createAsyncThunk("transfers/subscribe", (_, thunkAPI) => {
    const currentReducersState = thunkAPI.getState()
    const exchange = currentReducersState.exchangeReducers.exchange
    exchange.on('Deposit', (token, user, amount, balance, event) => {
        thunkAPI.dispatch(transferSuccess())
    })
    exchange.on('Withdraw', (token, user, amount, balance, event) => {
        thunkAPI.dispatch(transferSuccess())
    })
})

const transferSlice = createSlice({
    name: 'exchange',
    initialState,
    reducers: {
        transferSuccess: (state, action) => {
            return {
                ...state,
                event: action.event
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(transferTokens.pending, (state) => {
                state.status = "loading"
            })
            .addCase(transferTokens.rejected, (state, action) => {
                console.log(action)
                state.status = "failed"
            })
            .addCase(transferTokens.fulfilled, (state, action) => {
                state.transferType = action.payload.transferType
                state.transferTimes = action.payload.timestamp
                state.transferAmount = action.payload.transferAmount
                state.status = "idle"
            })
            .addCase(subscribeToTransfers.pending, (state) => {
                state.status = "loading"
            })
            .addCase(subscribeToTransfers.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(subscribeToTransfers.fulfilled, (state, action) => {
                state.status = "idle"
            })
    }
})

export const { transferSuccess } = transferSlice.actions;

export default transferSlice.reducer;
