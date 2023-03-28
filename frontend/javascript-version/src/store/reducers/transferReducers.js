import { ethers } from 'ethers'
import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";

const transferAdpter = createEntityAdapter();

const initialState = transferAdpter.getInitialState({
    transferType: null,
    status: "not-loaded"
})

export const transferTokens = createAsyncThunk("transfer/initTransfer", async (data) => {
    let transaction
    let provider = data.provider
    let exchange = data.exchange
    let transferType = data.transferType
    let token = data.token
    let amount = data.amount

    try {
        let signer = await provider.getSigner()
        let transferAmount = ethers.utils.parseUnits(amount.toString(), 18)

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
    }
    return transferType
})

const transferSlice = createSlice({
    name: 'exchange',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(transferTokens.pending, (state) => {
                state.status = "loading"
            })
            .addCase(transferTokens.rejected, (state) => {
                state.status = "failed"
            })
            .addCase(transferTokens.fulfilled, (state, action) => {
                state.transferType = action.payload.transferType
                state.status = "idle"
            })
    }
})

export default transferSlice.reducer;
