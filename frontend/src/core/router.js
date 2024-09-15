import { createBrowserRouter } from "react-router-dom";
import HomeContainer from "../containers/HomeContainer/HomeContainer";
import OrdersContainer from "../containers/OrdersContainer/OrdersContainer";
import PurchaseContainer from "../containers/PurchaseContainer/PurchaseContainer";
import SellContainer from "../containers/SellContainer/SellContainer";
import AssetsContainer from "../containers/AssetsContainer/AssetsContainer"
import LayoutWrapper from "../components/LayoutWrapper/LayoutWrapper.jsx";

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
