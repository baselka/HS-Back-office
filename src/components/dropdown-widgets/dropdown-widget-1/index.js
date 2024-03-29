import React, {useState, useEffect} from 'react'
import {useSelector, shallowEqual} from 'react-redux'
import {Box} from 'react-feather'
import apps from '../../../json/apps.json'
import Link from 'next/link'

const DropdownWidget1 = () => {
  const {direction} = useSelector(
    state => ({
      direction: state.ui.direction,
    }),
    shallowEqual
  )

  const [hidden, setHidden] = useState(true)
  const buttonRef = React.createRef()
  const dropdownRef = React.createRef()
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        hidden ||
        buttonRef.current.contains(event.target) ||
        dropdownRef.current.contains(event.target)
      ) {
        return false
      }
      setHidden(!hidden)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef, buttonRef])
  return (
    <div className="hidden lg:flex h-16 w-12">
      <div className="relative">
        <button
          ref={buttonRef}
          className="flex items-center justify-center h-16 w-12"
          onClick={() => setHidden(!hidden)}>
          <Box size={18} />
        </button>
        <div
          ref={dropdownRef}
          className={`navbar-dropdown dropdown ${direction === 'ltr' ? 'dropdown-right' : 'dropdown-left'} w-64 ${hidden ? '' : 'open'}`}>
          <div className="w-64 dropdown-content">
            <div className="navbar-dropdown-title dropdown-title">Apps</div>
            <div className="flex flex-wrap text-center">
              {apps.map((item, i) => (
                <Link href="/" key={i}>
                  <a
                    className="w-1/3 flex flex-col items-center justify-center h-20">
                    <i className={`${item.icon} text-xl font-bold mb-1`} />
                    <span className="text-xs">{item.title}</span>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DropdownWidget1
