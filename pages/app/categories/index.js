import React, { useState, useEffect } from 'react'
import Container from '../../Container'
import Layout from '../../../src/layouts'
import SectionTitle from '../../../src/components/section-title'
import LoadingModal from '../../../src/components/modals/LoadingModal'
import Datatable from '../../../src/components/datatable'
import Widget from '../../../src/components/widget'
import Api from '../../../src/api'
import { useRouter } from 'next/router'

const Simple = ( { categories } ) => {
  const columns = React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        width: 200,
      },
      {
        Header: 'الصورة',
        accessor: 'image_path',
        Cell: (props) => {
          return <div className="flex justify-center" >
          <img
            src={props.row.original.image_path}
            alt="image"
            className={`w-20 shadow rounded max-w-full border-none`}
          />
        </div>
        }
      },
      {
        Header: 'التصنيف',
        accessor: 'type_name'
      },
      {
        Header: 'الوصف',
        accessor: 'type_desc',
        Cell: (props) => {
          return <div className="text-right" >
            {props.row.original.type_desc}
        </div>
        }
      },
      {
        Header: 'ادوات',
        // accessor: 'id',
        Cell: (props) => {
          return <div className="text-right" >
            <a href="#" className="text-pink-900" >عرض الاقسام الفرعية</a>
        </div>
        }
      },
    ],
    []
  )
  return <Datatable columns={columns} data={categories} />
}

const Index = () => {
  const [categories, setCategories] = useState([])
  const router = useRouter();

  useEffect(() => {
    _getAllCategories()
  }, [])

  const _getAllCategories = () => {
    Api.Categories.all().then((res)=>{
      console.log('_getAllCategories', res);
      if(res.statusCode === 200){
        setCategories(res.data);
      }
    });
  }

  return (
    <Container>
      <Layout>
        <div className="flex text-sm mb-4">
          <div className="w-full">
              <SectionTitle title="إدارة التطبيق" subtitle="إدارة الأقسام الرئيسية" />
          </div>
        </div>

        { categories.length === 0 ? (
          <LoadingModal />
        ) : (
          <Widget title={" الأقسام الرئيسية ( "+ categories.length + " )"} >
            <div className="">
              <Simple categories={categories} />
            </div>
          </Widget>
        )}
      </Layout>
    </Container>
  )
}

export default Index
