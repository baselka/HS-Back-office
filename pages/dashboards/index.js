import React, { useState, useEffect } from 'react'
import Container from '../Container'
import Layout from '../../src/layouts'
import SectionTitle from '../../src/components/section-title'
import LoadingModal from '../../src/components/modals/LoadingModal'
import Widget from '../../src/components/widget'
import Bar from '../../src/components/charts/bar'
import BarCat from '../../src/components/charts/BarCat'
import Api from '../../src/api'
import { useRouter } from 'next/router'

const Dashboard1 = () => {
  const [details, setDetails] = useState(null)
  const [totalBranches, setTotalBranches] = useState(null)
  const [cities, setCities] = useState([])
  const [categories, setCategories] = useState([])
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
        setTotalBranches(res.data.totalBranches[0]);
        var citieslist = [];
        for (let index = 0; index < res.data.cities.length; index++) {
          const element = res.data.cities[index];
          citieslist.push({value:element.totalBranches, key:element.city});
        }
        setCities(citieslist);
        var catlist = [];
        for (let index = 0; index < res.data.categories.length; index++) {
          const element = res.data.categories[index];
          catlist.push({value:element.totalBranches, key:element.type_name});
        }
        setCategories(catlist);
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
            <div className="w-5/12 float-right border-l-4 border-transparent">
              <Widget
                title="إحصائيات عامة"
                description={""}>
                <div className="w-full mb-4">
                  <Bar height={400} bgColor={"bg-pink-400"} borderColor={"bg-pink-500"} stats={totalBranches} />
                </div>
              </Widget>
            </div>
            <div className="w-7/12 float-right border-r-8 border-transparent">
              <Widget
                title="الفروع حسب المدن"
                description={""}>
                <div className="w-full mb-4">
                  <BarCat height={400} bgColor={"bg-pink-400"} borderColor={"bg-pink-500"} stats={cities} />
                </div>
              </Widget>
            </div>
            <div className="w-full float-right mr-1">
              <Widget
                title="الفروع حسب التصنيف"
                description={""}>
                <div className="w-full mb-4">
                  <BarCat height={400} bgColor={"bg-pink-400"} borderColor={"bg-pink-500"} stats={categories} />
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
