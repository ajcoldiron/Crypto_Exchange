import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from 'ethers'
import tokenAbi from '../../abis/Token.json'
import exchangeAbi from '../../abis/Exchange.json'
import { RootState } from "../../core/redux";

interface ConnectionReducerState {
    ethersConnection: ethers.BrowserProvider | null;
    status: "not-loaded" | "loading"| "failed"| "idle";
    test: any;
}

const initialState: ConnectionReducerState = {
    status: "not-loaded",
    ethersConnection: null,
    test: null
}


export const initEthersConnection = createAsyncThunk("connection/initConnection", async () => {
    // const connection = new ethers.providers.Web3Provider(window.ethereum)
    const connection = new ethers.BrowserProvider((window as any).ethereum)
    console.log(connection);
    const { chainId } = await connection.getNetwork()
    console.log(chainId);
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts '})
    console.log(accounts);
    const account = await ethers.getAddress(accounts[0])
    console.log(account);
    const balance = await connection.getBalance(account)
    console.log(balance);
    const balanceFormatted = ethers.formatUnits(balance)
    console.log(balanceFormatted);

    // const token = new ethers.Contract(addresses[0], tokenAbi, provider)
    // const symbol = await token.symbol()

    // token = new ethers.Contract(addresses[1], tokenAbi, provider)
    // symbol = await token.symbol()

    
    // const exchange = new ethers.Contract(address, exchangeAbi, provider)
    return {
        chainId,
        accounts,
        account,
        balance: balanceFormatted
    }
});


const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(initEthersConnection.pending, (state) => {
                state.status = "loading"
            })
            .addCase(initEthersConnection.rejected, (state) => {
                state.status = "failed"

            })
            .addCase(initEthersConnection.fulfilled, (state,action) => {
                const {
                    chainId,
                    accounts,
                    account,
                    balance
                } = action.payload
                state.status = "idle"
                state.test = action.payload

            })
    }
})

// export const { providerLoaded, networkLoaded, accountLoaded, tokenLoaded, exchangeLoaded } = connectionSlice.actions;

// export const connectionSelectors = connectionAdpter.getSelectors((state: RootState) => state.cryptoReducer);

export default connectionSlice.reducer;
