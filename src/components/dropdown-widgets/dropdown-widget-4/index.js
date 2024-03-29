import React, {useState, useEffect} from 'react'
import {useSelector, shallowEqual} from 'react-redux'
import {MessageSquare} from 'react-feather'
import tasks from '../../../json/tasks.json'
import {ProgressBar} from '../../../components/progress-bars'

const DropdownWidget4 = () => {
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
          className="flex items-center justify-center h-16 w-12 relative"
          onClick={() => setHidden(!hidden)}>
          <MessageSquare size={18} />
            <span
              className="absolute badge badge-sm border border-white badge-circle badge-default bg-blue-500 hover:bg-blue-600 active:bg-blue-600 text-white hover:text-white active:text-white"
              style={{top: 14, right: 8}}>
              2
            </span>
        </button>
        <div
          ref={dropdownRef}
          className={`navbar-dropdown dropdown ${direction === 'ltr' ? 'dropdown-right' : 'dropdown-left'} w-64 ${hidden ? '' : 'open'}`}>
          <div className="w-64 dropdown-content">
            <div className="navbar-dropdown-title dropdown-title">Project status</div>
            <div className="flex flex-col">
              {tasks.map((item, i) => (
                <div className="flex flex-col p-2" key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-bold">{item.title}</div>
                    <div className="text-xs">{item.percent}%</div>
                  </div>
                  <ProgressBar
                    width={parseInt(item.percent, 10)}
                    color={item.color}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DropdownWidget4
