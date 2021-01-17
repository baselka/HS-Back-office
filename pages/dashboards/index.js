import React, { useEffect} from 'react'
import { useRouter } from 'next/router'
import Layout from '../../src/layouts'
import SectionTitle from '../../src/components/section-title'
import WidgetTitle from '../../src/components/widget-title'
import ProgressBarWidget from '../../src/components/dashboard-1/progress-bar-widget'
import DoughnutChart1 from '../../src/components/dashboard-1/doughnut-chart-1'
import Table1 from '../../src/components/dashboard-1/table-1'
import IconWidget from '../../src/components/dashboard-1/icon-widget'
import BarChart1 from '../../src/components/dashboard-1/bar-chart-1'
import LineChart1 from '../../src/components/dashboard-1/line-chart-1'
import TextWidget from '../../src/components/dashboard-1/text-widget'
import Table2 from '../../src/components/dashboard-1/table-2'
import {NotificationManager} from 'react-notifications'
import { wrapper } from '../../src/store'
import { checkServerSideCookie } from "../../src/actions/authActions"

const Dashboard1 = ({ token }) => {
  const router = useRouter();

  useEffect(() => {
      if(!token || !token.token || token.token === null){
          router.push('/pages/login');
      }
  });
  
  return (
    <Layout>
      <div className="w-full lg:px-2">
        <SectionTitle title="هابي سيزون" subtitle="لوحة التحكم الرئيسية" />

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

export default Dashboard1
