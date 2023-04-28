import { createBrowserRouter } from "react-router-dom";
import HomeContainer from "../components/containers/HomeContainer/HomeContainer";
import OrdersContainer from "../components/containers/OrdersContainer/OrdersContainer";
import PurchaseContainer from "../components/containers/PurchaseContainer/PurchaseContainer";
import SellContainer from "../components/containers/SellContainer/SellContainer";
import AssetsContainer from "../components/containers/AssetsContainer/AssetsContainer"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeContainer />,
    },
    {
        path: "/orders",
        element: <OrdersContainer />
    },
    {
        path: "/purchase",
        element: <PurchaseContainer />
    },
    {
        path: "/sell",
        element: <SellContainer />
    },
    {
        path: "/assets",
        element: <AssetsContainer />
    }
]);
