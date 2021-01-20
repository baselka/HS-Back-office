import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import Centered from '../../src/layouts/centered'
import Link from 'next/link'
import { connect } from "react-redux"
import { deauthenticate } from "../../src/actions/authActions"

const Logout = ({deauthenticate}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch({
        type: 'LOGIN_NOW',
        user: null
      });
      deauthenticate();
    }, 1000);
  })

  return (
    <Centered>
      {/*widget*/}
      <div className="w-full p-2">
        <div className="flex flex-col w-full items-center justify-start p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-current text-pink-700 inline-block h-24 w-24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </div>
      </div>
      {/*end widget*/}

      <h3 className="font-sans text-default mb-4 text-xl text-center font-bold">
        ----------
      </h3>

      <p className="text-secondary mb-4 text-center">
        تم تسجيل الخروج
      </p>
      <div className="flex text-sm mb-4">
        <Link href="/pages/login">
          <a className="text-center w-2/6 m-auto my-5 block px-6 py-3 uppercase font-bold text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:outline-none active:outline-none">
            تسجيل الدخول
          </a>
        </Link>
      </div>
    </Centered>
  )
}

export default connect((state) => state, { deauthenticate })(Logout);
