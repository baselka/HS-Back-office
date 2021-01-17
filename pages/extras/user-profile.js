import React, { useEffect } from "react";
import { useRouter } from 'next/router'
import { wrapper } from '../../src/store'
import { checkServerSideCookie } from "../../src/actions/authActions"
import Layout from '../../src/layouts'
import SectionTitle from '../../src/components/section-title'
import {UnderlinedTabs} from '../../src/components/tabs'
import AccountSettings from '../../src/components/profile/account-settings'
import EmailPreferences from '../../src/components/profile/email-preferences'
import SecuritySettings from '../../src/components/profile/security-settings'

const tabs = [
  {index: 0, title: 'إعدادت الحساب', content: <AccountSettings />},
  {index: 1, title: 'إعدادات البريد الإلكتروني', content: <EmailPreferences />},
  {index: 2, title: 'إعدادات الحماية', content: <SecuritySettings />}
]

const Index = ({ token }) => {
  const router = useRouter();

  useEffect(() => {
      if(!token || !token.token || token.token === null){
          router.push('/pages/login');
      }
  });

  return(
    <Layout>
      <SectionTitle title="الحساب" subtitle="إعدادات الملف الشخصي" />

      {/*widget*/}
      <div className="flex items-center justify-start px-2">
        <div className="flex-shrink-0 w-24">
          <img
            src="/assets/faces/m1.png"
            alt="image"
            className="shadow rounded-full h-20 w-20 border-2 border-gray-100 mb-2"
          />
        </div>
        <div className="py-2 px-2">
          <p className="text-default text-base font-bold whitespace-no-wrap">
            باسل ساتي
          </p>
          <p className="text-secondary text-sm whitespace-no-wrap">
            Admin
          </p>
        </div>
      </div>
      {/*end widget*/}

      <div className="flex flex-wrap">
        <div className="w-full p-4">
          <UnderlinedTabs tabs={tabs} />
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
