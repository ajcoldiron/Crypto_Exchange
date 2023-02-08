import { Layout, Menu } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import { useNavigate } from "react-router-dom"
import React from 'react'
import styles from './LayoutWrapper.module.css'

const LayoutWrapper = (props) => {
    const navigate = useNavigate();

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


  return (
    <Layout>
        <Header className={styles.header}>
            <Menu 
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['page-homepage']}
                items={pages}
                onSelect={handlePageChange}
            />
        </Header>
        <Content>

        </Content>
        
    </Layout>
  )
}

export default LayoutWrapper
