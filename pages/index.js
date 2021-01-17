import React, { useEffect } from 'react'
import {useRouter} from 'next/router'
import Layout from '../src/layouts/empty'
import { checkServerSideCookie } from "../src/actions/authActions";
import { wrapper } from '../src/store'
import * as Icon from 'react-feather'

const Index = (token) => {
  const router = useRouter()

  useEffect(() => {
    if(token.token && token.token !== null){
      router.push('/dashboards');
    }else{
      router.push('/pages/login');
    }
  })
  return (
    <Layout>
      <div className="flex justify-center w-screen h-screen content-center pt-80" style={{paddingTop:200}} > 
        <div className="w-15 h-20 text-center text-xl text-gray-800 py-80">
          <Icon.Loader size={30} className="m-auto" />
          ... loading ...
        </div>
      </div>
    </Layout>
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
