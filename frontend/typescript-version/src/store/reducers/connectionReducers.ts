import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from 'ethers'
import { RootState } from "../../core/redux";
import { ExternalProvider } from "@ethersproject/providers";

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}

interface ConnectionReducerState {
    ethersConnection: ethers.providers.Web3Provider | null;
    status: "not-loaded" | "loading"| "failed"| "idle";
    network: any;
    account: string;
    balance: string;
}

const initialState: ConnectionReducerState = {
    status: "not-loaded",
    ethersConnection: null,
    network: null,
    account: "",
    balance: ""
}

export const loadProvider = createAsyncThunk("connection/initConnection", () => {
    const connection = new ethers.providers.Web3Provider((window as any).ethereum)
    return connection
})

export const loadNetwork = createAsyncThunk("network/initNetwork", async (connection : any) => {
    const network = await connection.getNetwork()
    return network
})

export const initAccountConnection = createAsyncThunk("account/initAccount", async (connection : any) => {
    let account: any;
    let balance: any;
    try{


        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts '})
        const account = ethers.utils.getAddress(accounts[0])
        let balance = await connection.getBalance(account)
        balance = ethers.utils.formatEther(balance)

    } catch(e) {
        console.log(e)
    }
    return {
        account,
        balance
    }
});

const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(loadProvider.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadProvider.rejected, (state) => {
                state.status = "failed"

            })
            .addCase(loadProvider.fulfilled, (state, action) => {
                state.ethersConnection = action.payload
                state.status = "idle"
            })
            .addCase(loadNetwork.pending, (state) => {
                state.status = "loading"
            })
            .addCase(loadNetwork.rejected, (state) => {
                state.status = "failed"

            })
            .addCase(loadNetwork.fulfilled, (state, action) => {
                state.network = action.payload
                state.status = "idle"
            })
            .addCase(initAccountConnection.pending, (state) => {
                state.status = "loading"
            })
            .addCase(initAccountConnection.rejected, (state) => {
                state.status = "failed"

            })
            .addCase(initAccountConnection.fulfilled, (state, action) => {
                state.account = action.payload.account
                state.balance = action.payload.balance
                state.status = "idle"
            })
    }
})


// export const connectionSelectors = connectionAdpter.getSelectors((state: RootState) => state.cryptoReducer);

export default connectionSlice.reducer;
