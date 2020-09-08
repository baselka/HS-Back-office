import React from 'react'
import Link from 'next/link'
import Layout from '../layouts/empty'
import {withRedux} from '../lib/redux'
import ChangeDirection from '../components/change-direction'
import Logo from '../components/landing/logo'
import Icons from '../components/landing/icons'
import Images from '../components/landing/images'
import Title from '../components/landing/title'
import Text from '../components/landing/text'
import Features from '../components/landing/features'
import Options from '../components/landing/options'
import Screenshots from '../components/landing/screenshots'
import Sidebars from '../components/landing/sidebars'

const Index = () => (
  <Layout>
    <div
      className={`homepage bg-white text-default w-full py-4 px-8 flex items-center justify-start shadow`}>
      <Logo />
      <div className="hidden lg:flex homepage-navbar-actions">
        <Link href="/documentation">
          <a className="btn btn-default">Documentation</a>
        </Link>
        <a
          href="https://themeforest.net/item/concavo-react-tailwind-css-admin-template/26535790"
          target="_blank"
          className="btn btn-default bg-indigo-700 text-white rounded-lg">
          Purchase now
        </a>
      </div>
      <ChangeDirection />
    </div>
    <div className="container max-w-screen-lg mx-auto lg:px-4">
      {/*section*/}
      <div className="mb-4 lg:mb-16 pt-4 lg:pt-24">
        <div className="flex flex-wrap items-center">
          <div className="w-full p-4 lg:w-3/5 lg:px-8">
            <Title />
            <Text />
            <div className="flex flex-row items-center justify-start mb-6">
              <Icons />
            </div>
            <div className="flex flex-row items-center justify-start">
              <a
                href="https://themeforest.net/item/concavo-react-tailwind-css-admin-template/26535790"
                target="_blank"
                className="btn btn-default btn-lg bg-indigo-700 text-white rounded-lg">
                Purchase now
              </a>
            </div>
          </div>
          <div className="hidden lg:flex lg:w-2/5">
            <Images />
          </div>
        </div>
      </div>

      {/*section*/}
      <Options />

      {/*section*/}
      <Features />

      {/*section*/}
      <Screenshots />

      <div className="text-center text-xs text-gray-400 pb-4">
        &copy; 2020 Batchthemes
      </div>
    </div>
  </Layout>
)

export default withRedux(Index)
