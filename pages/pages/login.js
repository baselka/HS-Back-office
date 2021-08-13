import React, {useState} from 'react'
import {useSelector, shallowEqual} from 'react-redux'
import Layout from '../../src/layouts/empty'
import Link from 'next/link'
import Form from '../../src/components/login-2'

const Logo = () => {
  const {name} = useSelector(
    state => ({
      name: state.ui.name
    }),
    shallowEqual
  )
  return (
    <div
      className={`bg-transparent text-white flex flex-row items-center uppercase font-bold text-2xl tracking-wider justify-start z-10`}>
      <Link href="/">
        <a className="flex flex-row items-center justify-start">
          <img
            alt=""
            className="h-full w-12"
            src="/logo-white.png"
          />
          <span className="ltr:ml-1 rtl:mr-2 font-sans">{name}</span>
        </a>
      </Link>
    </div>
  )
}

const Login = () => {
  const {name} = useSelector(
    state => ({
      name: state.ui.name
    }),
    shallowEqual
  )
  return (
    <Layout>
      <div className="w-full flex flex-row h-screen overflow-hidden">
        <div className="hidden lg:flex lg:flex-col w-1/2 bg-pink-700 text-white p-8 items-start justify-between relative">
          <img
            alt="bg"
            className="img1 absolute inset-0 z-0 object-contain h-auto w-full"
            src="/bg-login-1.png"
          />
          <style jsx>{`
            .img1 {
              opacity: 0.05;
            }
          `}</style>
          <Logo />
          <div className="flex flex-col z-10">
            <p className="text-3xl font-bold font-poppins mb-4">
              اهلا بك في {name}!
            </p>
            <p className="text-xl font-thin">
              دليلك الخاص - لكل مناسباتك
            </p>
          </div>
          <div className="flex flex-row items-center justify-between w-full text-xs z-10">
            <div className="text-white">&copy; {name} 2021</div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-white text-default p-8 lg:p-24 flex flex-col items-center justify-center">

          <img
            alt=""
            className="h-auto w-2/12 my-10 mt-0"
            src="/logo.png"
          />
          <p className="text-2xl font-bold font-cairo mb-4">
            تسجيل الدخول
          </p>
          <div className="w-full mb-4">
            
          </div>
          <Form />
        </div>
      </div>
    </Layout>
  )
}

export default Login
