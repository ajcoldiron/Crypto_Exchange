import { createBrowserRouter } from "react-router-dom";
import HomeContainer from "../components/containers/HomeContainer/HomeContainer";
import OrdersContainer from "../components/containers/OrdersContainer/OrdersContainer";
import PurchaseContainer from "../components/containers/PurchaseContainer/PurchaseContainer";
import SellContainer from "../components/containers/SellContainer/SellContainer";
import AssetsContainer from "../components/containers/AssetsContainer/AssetsContainer"
import Layout from "antd/es/layout/layout";
import LayoutWrapper from "../components/LayoutWrapper.jsx/LayoutWrapper";

const homepageLoader = () => {
    return {
        pageKey: "page-homepage"
    }
}

const ordersLoader = () => {
    return {
        pageKey: "page-orders"
    }
}

const purchaseLoader = () => {
    return {
        pageKey: "page-purchase"
    }
}

const sellLoader = () => {
    return {
        pageKey: "page-sell"
    }
}

const assetsLoader = () => {
    return {
        pageKey: "page-assets"
    }
}

export const router = createBrowserRouter([
    {
        element: <LayoutWrapper />,
        children: [
            {
                path: "/",
                element: <HomeContainer/>,
                loader: homepageLoader,
            },
            {
                path: "/orders",
                loader: ordersLoader,
                element: <OrdersContainer />
            },
            {
                path: "/purchase",
                loader: purchaseLoader,
                element: <PurchaseContainer />
            },
            {
                path: "/sell",
                loader: sellLoader,
                element: <SellContainer />
            },
            {
                path: "/assets",
                loader: assetsLoader,
                element: <AssetsContainer />
            }
        ]
    },
]);
