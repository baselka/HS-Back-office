import React, { useState, useEffect } from 'react'
import Container from '../../Container'
import Layout from '../../../src/layouts'
import SectionTitle from '../../../src/components/section-title'
import LoadingModal from '../../../src/components/modals/LoadingModal'
import Datatable from '../../../src/components/datatable'
import Widget from '../../../src/components/widget'
import Api from '../../../src/api'
import { useRouter } from 'next/router'

const Simple = ( { cities } ) => {
  const columns = React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        width: 200,
      },
      {
        Header: 'المنطقة',
        accessor: 'region'
      },
      {
        Header: 'المدينة',
        accessor: 'city',
      }
    ],
    []
  )
  return <Datatable columns={columns} data={cities} />
}

const Index = () => {
  const [cities, setCities] = useState([])
  const router = useRouter();

  useEffect(() => {
    _getAllCities()
  }, [])

  const _getAllCities = () => {
    Api.Cities.all().then((res)=>{
      console.log('_getAllCities', res);
      if(res.statusCode === 200){
        setCities(res.data);
      }
    });
  }

  return (
    <Container>
      <Layout>
        <div className="flex text-sm mb-4">
          <div className="w-full">
            <SectionTitle title="إدارة التطبيق" subtitle="إدارة المدن" />
          </div>
        </div>

        { cities.length === 0 ? (
          <LoadingModal />
        ) : (
          <Widget title={"قائمة المدن ( "+ cities.length + " )"} >
            <div className="">
              <Simple cities={cities} />
            </div>
          </Widget>
        )}
      </Layout>
    </Container>
  )
}

export default Index
