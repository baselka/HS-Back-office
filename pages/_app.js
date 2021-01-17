/* eslint-disable react/prop-types */

import React from 'react'
import Head from 'next/head'
import { initializeStore, wrapper } from '../src/store'
import Router from 'next/router'
import NProgress from 'nprogress'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { CookiesProvider } from 'react-cookie'
import '../src/scss/styles.scss'
import '../src/scss/_components.scss'
import '../src/scss/_layouts.scss'
import '../src/scss/_palettes.scss'
import '../src/scss/react-circular-progressbar.scss'
import '../src/scss/rc-slider.scss'
import '../src/scss/react-datetime.scss'
import '../src/scss/react-notifications.scss'
import '../src/scss/nprogress.scss'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())
const store = initializeStore()
const persistor = persistStore(store)

const MyApp = ({ Component, pageProps }) => (
    <div>
        <CookiesProvider>
            <Provider store={store}>
                <Head>
                    <title>هابي سيزون</title>
                    <link rel="shortcut icon" href="/public/favicon.ico" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1, shrink-to-fit=no"
                    />
                    <script src="https://unpkg.com/feather-icons/dist/feather.min.js"> </script>
                </Head>
                <PersistGate loading={null} persistor={persistor}>
                    <Component {...pageProps} />
                </PersistGate>
            </Provider>
        </CookiesProvider>
    </div>
)

export default wrapper.withRedux(MyApp)
