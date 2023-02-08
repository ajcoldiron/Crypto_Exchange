import React from 'react'
import { useLoaderData } from 'react-router'
import LayoutWrapper from '../../LayoutWrapper.jsx/LayoutWrapper'

const AssetsContainer = () => {
  const { pageKey } = useLoaderData();

  return (
    <LayoutWrapper currentRoute={pageKey}>
      <h1>Assets</h1>
    </LayoutWrapper>
  )
}

export default AssetsContainer
