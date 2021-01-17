import React, {useState, useEffect} from 'react'
import {Settings} from 'react-feather'
import {useSelector, shallowEqual} from 'react-redux'
import Link from 'next/link'
import * as Icon from 'react-feather'
import {CircularBadge} from '../../badges'
import { useRouter } from 'next/router'

const DropdownWidget5 = () => {
  const router = useRouter()
  const {direction} = useSelector(
    state => ({
      direction: state.ui.direction,
    }),
    shallowEqual
  )

  const [hidden, setHidden] = useState(true)
  const {user} = useSelector(
    state => ({
      user: state.ui.user
    }),
    shallowEqual
  )

  return (
    <div className="flex items-center justify-center h-16 w-8 mx-2">
      <div className="relative">
        <button
          className="flex h-16 w-8 rounded-full ml-2 relative"
          onClick={() => router.push('/extras/user-profile')}>
          <span className="absolute top-0 left-0 pt-4">
            <img
              className="h-8 w-8 rounded-full shadow"
              src={`/assets/faces/${user.img}`}
              alt={user.fullName}
            />
          </span>
        </button>
      </div>
    </div>
  )
}

export default DropdownWidget5
