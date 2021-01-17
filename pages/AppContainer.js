import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { initializeStore, wrapper } from '../src/store'
import { checkServerSideCookie } from "../src/actions/authActions"

const Index = ({ Component, pageProps, token }) => {
    const router = useRouter();

    useEffect(() => {
        const pathname = router.pathname;
        console.log('MyApp pathname', pathname);
        console.log('MyApp token', token);
        if(!token || !token.token || token.token === null){
            if(pathname !== "/pages/login"){
                console.log('Redirecting....');
                router.push('/pages/login');
            }
        }
    });

    return (
        <Component {...pageProps} />
    )
}

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    checkServerSideCookie(context);
    const token = context.store.getState().authentication.token;
    return { props: { token } };
  }
);

export default Index
