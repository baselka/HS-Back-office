import React, {useEffect} from 'react'
import {useRouter} from 'next/router'
import {useSelector, useDispatch, shallowEqual} from 'react-redux'


const Index = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch({
      type: 'SET_DEMO',
      layout: 'layout-1',
      direction: 'rtl',
      collapsed: false,
      palettes: {
        background: 'bg-gray-900',
        logo: 'bg-gray-800',
        leftSidebar: 'bg-gray-800',
        rightSidebar: 'white',
        navbar: 'bg-gray-900',
        topNavigation: 'bg-gray-900'
      },
      leftSidebar: {
        showButtonText: true,
        showSectionTitle: true,
        showLogo: true,
        showCard: true,
        showAccountLinks: false,
        card: 1
      }
    })
  })
  router.push('/dashboards/dashboard-1')
  return null
}
export default (Index)
