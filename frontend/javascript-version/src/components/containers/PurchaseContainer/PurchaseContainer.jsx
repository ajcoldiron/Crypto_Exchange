import React from 'react'
import { useLoaderData } from 'react-router';
import LayoutWrapper from '../../LayoutWrapper.jsx/LayoutWrapper';

const PurchaseContainer = () => {
  const { pageKey } = useLoaderData();

  

  return (
    <LayoutWrapper currentRoute={pageKey}>
      <div>
        <div>

        </div>
        <div>
          
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default PurchaseContainer
