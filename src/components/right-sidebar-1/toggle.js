import React from 'react'
import {X} from 'react-feather'
import {useSelector, useDispatch, shallowEqual} from 'react-redux'

const Toggle = ({title, palettes, name}) => {
  const {toggleRightSidebar} = useSelector(
    state => ({
      toggleRightSidebar: state.ui.toggleRightSidebar
    }),
    shallowEqual
  )
  const dispatch = useDispatch()
  return (
    <button
      onClick={() =>
        dispatch({
          type: 'SET_CONFIG',
          config: {
            key: 'toggleRightSidebar',
            value: !toggleRightSidebar
          }
        })
      }
      className="btn btn-transparent btn-circle">
      <X />
    </button>
  )
}

export default Toggle
