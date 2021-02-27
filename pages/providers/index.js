import React, { useState, useEffect } from 'react'
import Container from '../Container'
import Layout from '../../src/layouts'
import SectionTitle from '../../src/components/section-title'
import LoadingModal from '../../src/components/modals/LoadingModal'
import Datatable from '../../src/components/datatable'
import Widget from '../../src/components/widget'
import Api from '../../src/api'
import { useRouter } from 'next/router'

const Simple = ( { providers } ) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'الاسم',
        accessor: 'full_name',
      },
      {
        Header: 'البريد الالكتروني',
        accessor: 'email'
      },
      {
        Header: 'جوال',
        accessor: 'phone',
      },
      {
        Header: 'الحالة',
        accessor: 'status',
        Cell: (props) => {
          return <div className="text-center" >
            {props.row.original.status ? "فعال" : "غير مفعل"}
        </div>
        }
      }
    ],
    []
  )
  return <Datatable columns={columns} data={providers} />
}

const Index = () => {
  const [providers, setProviders] = useState([])
  const router = useRouter();

  useEffect(() => {
    _getProvidersList()
  }, [])

  const _getProvidersList = () => {
    let data = {
      start: 0,
      end: 1000
    }
    Api.Providers.all(data).then((res)=>{
      console.log('_getProvidersList', res);
      if(res.statusCode === 200){
        setProviders(res.data);
      }
    });
  }

  return (
    <Container>
      <Layout>
        <div className="flex text-sm mb-4">
          <div className="w-full">
            <SectionTitle title="إدارة مقدمي الخدمات" subtitle="إدارة حساب مقدم خدمة" />
          </div>
        </div>

        { providers.length === 0 ? (
          <LoadingModal />
        ) : (
          <Widget title={"قائمة مقدمي الخدمات ( "+ providers.length + " )"} >
            <div className="">
              <Simple providers={providers} />
            </div>
          </Widget>
        )}
      </Layout>
    </Container>
  )
}

export default Index
