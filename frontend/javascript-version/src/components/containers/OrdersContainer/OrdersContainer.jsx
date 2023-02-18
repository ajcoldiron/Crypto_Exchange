import React from 'react'
import { useLoaderData } from 'react-router'
import LayoutWrapper from '../../LayoutWrapper.jsx/LayoutWrapper'

const OrdersContainer = () => {
  const { pageKey } = useLoaderData();

  return (
    <LayoutWrapper currentRoute={pageKey}>
      <h1>Orders</h1>
    </LayoutWrapper>
  )
}

export default OrdersContainer
