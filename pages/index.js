import React, { useEffect } from 'react'
import Container from './Container'
import { useRouter } from 'next/router'
import * as Icon from 'react-feather'
import cookie from "js-cookie"

const Index = () => {
  const token = cookie.get('token'); 
  const router = useRouter();

  useEffect(() => {
      if(!token || token == null){
        router.push('/pages/login');
      }else{
        router.push('/dashboards');
      }
  });

  return (
    <Container>
        <div className="flex justify-center w-screen h-screen content-center pt-80" style={{paddingTop:200}} > 
          <div className="w-15 h-20 text-center text-xl text-gray-800 py-80">
            <Icon.Loader size={30} className="m-auto" />
            ... loading ...
          </div>
        </div>
    </Container>
  )
}

export default Index
