import Link from 'next/link'
import {LogOut} from 'react-feather'
import {useSelector, useDispatch, shallowEqual} from 'react-redux'
import {Settings, Menu} from 'react-feather'
import DropdownWidget1 from '../dropdown-widgets/dropdown-widget-1'
import DropdownWidget2 from '../dropdown-widgets/dropdown-widget-2'
import DropdownWidget3 from '../dropdown-widgets/dropdown-widget-3'
import DropdownWidget4 from '../dropdown-widgets/dropdown-widget-4'
import DropdownWidget5 from '../dropdown-widgets/dropdown-widget-5'
import Search from './search'
import ChangeDirection from '../change-direction'

const Navbar = () => {
  const {toggleRightSidebar, collapsed} = useSelector(
    state => ({
      toggleRightSidebar: state.ui.toggleRightSidebar,
      collapsed: state.ui.collapsed
    }),
    shallowEqual
  )
  const dispatch = useDispatch()
  return (
    <div className="navbar navbar-1">
      <div className="navbar-inner w-full flex items-center justify-start">
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
          className="mx-4">
          <Menu size={20} />
        </button>

        <span className="ltr:ml-auto rtl:mr-auto"></span>

        <DropdownWidget5 />
        <Link href="/pages/logout">
          <a className="btn btn-default flex lg:hidden">تسجيل الخروج</a>
        </Link>
        <Link href="/pages/logout">
          <a className="btn btn-default hidden lg:flex">تسجيل الخروج</a>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
