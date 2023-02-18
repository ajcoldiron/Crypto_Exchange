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
    let connection: any;
    let chainId: any;
    let account: any;
    try{
    // const connection = new ethers.providers.Web3Provider(window.ethereum)
    connection = new ethers.BrowserProvider((window as any).ethereum)
    console.log(connection);
    const {chainId: newChainId} = await connection.getNetwork()
    chainId = newChainId
    // console.log(network);
    // const test  =await connection
    // console.log(test)
    // const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts '})
    // console.log(accounts);
    // const accounts: any = []
    // account = await ethers.getAddress("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")
    // console.log(account);
    // const balance = await connection.getBalance(account)
    // console.log(balance);
    // const balanceFormatted = ethers.formatUnits(balance)
    // const balanceFormatted = balance.toString()
    // console.log(balanceFormatted);

    // const token = new ethers.Contract(addresses[0], tokenAbi, provider)
    // const symbol = await token.symbol()

    // token = new ethers.Contract(addresses[1], tokenAbi, provider)
    // symbol = await token.symbol()
    } catch(e) {
        console.log(e)
    }
    
    // const exchange = new ethers.Contract(address, exchangeAbi, provider)
    return {
        connection: 2,
        chainId: 3,
        account: 4,
        // balance: balanceFormatted
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
            .addCase(initEthersConnection.fulfilled, (state) => {
                // const {
                //     // connection,
                //     // chainId,
                //     // account,
                // } = action.payload
                state.status = "idle"
                // state.test = chainId

            })
    }
})

// export const { providerLoaded, networkLoaded, accountLoaded, tokenLoaded, exchangeLoaded } = connectionSlice.actions;

// export const connectionSelectors = connectionAdpter.getSelectors((state: RootState) => state.cryptoReducer);

export default connectionSlice.reducer;
