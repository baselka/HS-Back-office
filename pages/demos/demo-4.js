import React, {useEffect} from 'react'
import {useRouter} from 'next/router'
import {useSelector, useDispatch, shallowEqual} from 'react-redux'


const Index = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch({
      type: 'SET_DEMO',
      layout: 'layout-2',
      direction: 'ltr',
      collapsed: false,
      palettes: {
        background: 'white',
        logo: 'white',
        leftSidebar: 'white',
        rightSidebar: 'white',
        navbar: 'bg-gray-900',
        topNavigation: 'white'
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
