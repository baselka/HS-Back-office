import React from 'react'
import {ToggleLeft} from 'react-feather'
import {useSelector, shallowEqual} from 'react-redux'
import Link from 'next/link'

const Logo = () => {
  const {name} = useSelector(
    state => ({
      name: state.ui.name,
    }),
    shallowEqual
  )
  return (
    <div
      className="logo flex flex-row items-center uppercase font-bold text-lg tracking-wider justify-center mb-4">
      <Link href="/">
        <a className="flex flex-row items-center justify-start children-x-1">
          <img
            alt=""
            className="h-full w-12"
            src="/logo.png"
          />
          <span>{name}</span>
        </a>
      </Link>
    </div>
  )
}

export default Logo
