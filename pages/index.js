import React, { useEffect } from 'react'
import Container from './Container'
import { useRouter } from 'next/router'
import * as Icon from 'react-feather'
import cookie from "js-cookie"
import LoadingModal from '../src/components/modals/LoadingModal'

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
      <LoadingModal />
    </Container>
  )
}

export default Index
