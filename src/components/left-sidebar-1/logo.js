import React from 'react'
import {ToggleLeft, X} from 'react-feather'
import {useSelector, useDispatch, shallowEqual} from 'react-redux'
import Link from 'next/link'
import {getColor} from '../../functions/colors'

const Logo = () => {
  const {name, leftSidebar, collapsed} = useSelector(
    state => ({
      name: state.ui.name,
      collapsed: state.ui.collapsed,
      leftSidebar: state.ui.leftSidebar
    }),
    shallowEqual
  )
  const {showLogo} = {...leftSidebar}
  if (!showLogo) return null
  const dispatch = useDispatch()
  return (
    <div
      className="logo h-16 flex flex-row items-center uppercase font-bold text-lg tracking-wider justify-between px-4">
      <Link href="/">
        <a className="flex flex-row items-center justify-start children-x-1">
          <img
            alt=""
            className="h-full w-12"
            src="/logo-white.png"
          />
          <span>{name}</span>
        </a>
      </Link>
      <button
        onClick={() =>
          dispatch({
            type: 'SET_CONFIG',
            config: {
              key: 'collapsed',
              value: !collapsed
            }
          })
        }
        className="btn btn-circle">
        <X size={24} />
      </button>
    </div>
  )
}

export default Logo
