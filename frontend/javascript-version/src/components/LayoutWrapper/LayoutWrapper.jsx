import { Layout, Menu, Select } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useMemo, useState } from 'react'
import styles from './LayoutWrapper.module.css'
import { useSelector } from 'react-redux'
import config from  '../../config.json'

const LayoutWrapper = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const account = useSelector(state => state.connectionReducers?.account)
    const chainId = useSelector(state => state.connectionReducers.network)
    
    const addressMapping = {
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266": "Local Host User1",
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8": "Local Host User2",
        "0x34a685bD5366D48BF53d4C91F621A250769DC641": "Sepolia User1",
        "0x24fC0A7B9620994d1B5211b36A841a1089ebaF66": "Sepolia User2",
    }

    window.ethereum.on('chainChanged', () => {
        window.location.reload()
    })

    const networkHandler = async (e) => {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: e }],
        })
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
    if(account) {
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
            {chainId && (
                <div className={styles.networkSelectWrapper}>
                <span className={styles.networkSelectLabel}>Select Network</span>
                <div className={styles.selectContainer}>
                  <Select name="networks" id="networks" value={chainId} onChange={networkHandler}>
                    <Select.Option value="" disabled hidden>
                      Select Network
                    </Select.Option>
                    <Select.Option value="0x7A69">Localhost</Select.Option>
                    <Select.Option value="0xaa36a7">Sepolia</Select.Option>
                  </Select>
                </div>
              </div>
            )}
      </Header>
      <Content className={styles.content}><Outlet /></Content>
    </Layout>
  )
}

export default LayoutWrapper
