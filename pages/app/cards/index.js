import React, { useEffect } from "react";
import { useRouter } from 'next/router'
import { wrapper } from '../../../src/store'
import { checkServerSideCookie } from "../../../src/actions/authActions"
import Layout from '../../../src/layouts'
import SectionTitle from '../../../src/components/section-title'

const Index = ({ token }) => {
  const router = useRouter();

  useEffect(() => {
      if(!token || !token.token || token.token === null){
          router.push('/pages/login');
      }
  });
  return (
    <Layout>
      <SectionTitle title="إدارة التطبيق" subtitle="كروت الدعوة" />
      <p>-</p>
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
