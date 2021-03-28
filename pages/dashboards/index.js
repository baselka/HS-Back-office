import React, { useState, useEffect } from 'react'
import Container from '../Container'
import Layout from '../../src/layouts'
import SectionTitle from '../../src/components/section-title'
import LoadingModal from '../../src/components/modals/LoadingModal'
import Widget from '../../src/components/widget'
import Bar from '../../src/components/charts/bar'
import Api from '../../src/api'
import { useRouter } from 'next/router'

const Dashboard1 = () => {
  const [details, setDetails] = useState(null)
  const [totalBranches, setTotalBranches] = useState(null)
  const [statistics, setStatistics] = useState(null)
  const [loadingData, setLoadingData] = useState(true)
  const router = useRouter();

  useEffect(() => {
    _getStatistics()
  }, [])

  const _getStatistics = () => {
    Api.Stats.all({}).then((res)=>{
      console.log("_getStatistics", res);
      setLoadingData(false);
      if(res.statusCode === 200){
        setStatistics(res.data);
        setTotalBranches(res.data.totalBranches[0]);
      }
    });
  }

  return (
    <Container>
      <Layout>
        <div className="flex text-sm mb-4">
          <div className="w-full">
            <SectionTitle title="هابي سيزون" subtitle="لوحة التحكم الرئيسية" />
          </div>
        </div>

        { loadingData ? (
          <LoadingModal />
        ) : (
          <div className="">
            <div className="w-6/12 float-right ml-6">
              <Widget
                title="إحصائيات"
                description={""}>
                <div className="w-full mb-4">
                  <Bar height={400} bgColor={"bg-pink-400"} borderColor={"bg-pink-500"} stats={totalBranches} />
                </div>
              </Widget>
            </div>
            <div className="w-5/12 float-right mr-1">
              <Widget
                title="حسب المدن الفروع"
                description={""}>
                <div className="w-full mb-4">
                  {/* <Bar height={400} bgColor={"bg-pink-400"} borderColor={"bg-pink-500"} stats={totalBranches} /> */}
                </div>
              </Widget>
            </div>
          </div>
        )}
      </Layout>
    </Container>
  )
}

export default Dashboard1
