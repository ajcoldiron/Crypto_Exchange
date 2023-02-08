import React from 'react'
import { useLoaderData } from 'react-router'
import LayoutWrapper from '../../LayoutWrapper.jsx/LayoutWrapper';

const SellContainer = () => {
  const { pageKey } = useLoaderData();

  return (
    <LayoutWrapper currentRoute={pageKey}>
      <h1>Sell</h1>
    </LayoutWrapper>
  )
}

export default SellContainer
