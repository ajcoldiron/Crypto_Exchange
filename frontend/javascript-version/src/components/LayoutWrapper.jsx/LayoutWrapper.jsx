import { Layout, Menu } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import { useLocation, useNavigate } from "react-router-dom"
import { useMemo } from 'react'
import styles from './LayoutWrapper.module.css'
import { useSelector } from 'react-redux'

const LayoutWrapper = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const account = useSelector(state => state.connectionReducers.account)

    const addressMapping = {
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266": "User1",
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8": "User2",
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC": "User3",
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC": "User4",
        "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65": "User5"
    }


    const currentPageKey = useMemo(() => {
        const currentPath = location.pathname;
        switch(currentPath) {
            case "/":
                return "page-homepage";
            case "/orders":
                return "page-orders";
            case "/purchase":
                return "page-purchase";
            case "/sell":
                return "page-sell";
            case "/assets":
                return "page-assets";
            default: 
                return "page-homepage";
        }
    }, [location.pathname])

    const pages = [
        {
            key: "page-homepage",
            label: "Home Page"
        },
        {
            key: "page-orders",
            label: "Orders"
        },
        {
            key: "page-purchase",
            label: "Purchase"
        },
        {
            key: "page-sell",
            label: "Sell"
        },
        {
            key: "page-assets",
            label: "Assets"
        }
    ]

    const handlePageChange = (item) => {
        const pageKey = item.key;
        switch (pageKey) {
            case "page-homepage":
                navigate("/");
                break;
            case "page-orders":
                navigate("/orders")
                break;
            case "page-purchase":
                navigate("/purchase")
                break;
            case "page-sell":
                navigate("/sell")
                break;
            case "page-assets":
                navigate("/assets")
                break;
            default:
        }
    }

    const items = pages.map(page => {
        return {
            key: page.key,
            label: page.label
        }
    })
    if( account) {
        items.push(
            {
                key: "page-account",
                label: `${addressMapping[account] || 'User'}: ${account}`
            }
        )
    }

  return (
    <Layout>
      <Header className={styles.header}>
        <Menu theme="dark" mode="horizontal" selectedKeys={[currentPageKey]} onClick={handlePageChange} items={items} />
      </Header>
      <Content>{props.children}</Content>
    </Layout>
  )
}

export default LayoutWrapper
